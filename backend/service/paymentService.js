import Payment from "../model/Payment.js";

export const getPaymentId = async (checkout_id) => {
    try{
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              authorization: `Basic ${process.env.PAYMONGO_KEY}`
            }
          };
          
        const response = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${checkout_id}`, options)
        if(response.ok){
            const result = await response.json();
            return result.data.attributes.payments[0].id
        }
        return null
    }catch(err){
        console.log(err)
        return null
    }
}

export const refundPayment = async (payment_id, amount) => {
    try{
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authorization: `Basic ${process.env.PAYMONGO_KEY}`
            },
            body: JSON.stringify({
              data: {
                attributes: {
                  amount,
                  payment_id,
                  reason: 'others'
                }
              }
            })
          };
          const response= await fetch('https://api.paymongo.com/refunds', options)
          if(response.ok){
            return await response.json();
          }
          return null
    }catch(err){
      console.log(err)
        return null
    }
}

export const createPayment = async (data, booking_id) => {
      data.flights.forEach(async (flight) => {
        const vatRate = 12 / 100;
        const totalTicketPrice = flight.passengers.reduce((total, passenger) => 
            total + ((passenger.pwd || passenger.senior_citizen) 
                && flight.departure_country === 'Philippines' 
                && flight.arrival_country === 'Philippines' ? 0 : passenger.price), 0)
        const paymentDetails = [
          {amount: 523, name: 'Fuel Surcharge', quantity: flight.passengers.length},
          {amount: 450, name: 'Passenger Service Charge', quantity:  flight.passengers.length},
          {amount: 900, name: 'Terminal Fee', quantity: flight.passengers.length},
          {amount: 30, name: 'Aviation Security Fee', quantity: flight.passengers.length},
        ]
        
        flight.passengers.forEach(passenger=> {
            const isDiscounted = (passenger.pwd || passenger.senior_citizen) 
            && flight.departure_country === 'Philippines' 
            && flight.arrival_country === 'Philippines';
            const fareAmount = isDiscounted ? passenger.price * 0.80 : passenger.price;
            const item = {
                currency: 'PHP',
                amount: fareAmount, 
                name: `${flight.destination}-${passenger.type} (${data.fareType} Tier)`,
                quantity: 1
            };
            paymentDetails.push(item); 
        })
        if(vatRate * totalTicketPrice){
          paymentDetails.push({currency: 'PHP', amount: vatRate * totalTicketPrice , name: 'VAT (12%) on base fare', quantity: 1})
        }
        const total_amount = paymentDetails.reduce((total, paymentDetail) => total + (paymentDetail.amount * paymentDetail.quantity), 0)
        const payment = await Payment.create({
            booking_id: booking_id,
            flight_id: flight.id,
            total_amount, 
            line_items: paymentDetails
        })
        await payment.save();
      })

      const adminFee = await Payment.create({
        booking_id: booking_id,
        total_amount: 400,
        line_items: [
          {amount: 400, name: 'Administration Fee', quantity: 1}
        ]
      })

      await adminFee.save();
}