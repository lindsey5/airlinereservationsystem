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
          console.log(await response.json())
          return null
    }catch(err){
        return null
    }
}

export const createPayment = async (data, booking_id) => {
      data.flights.forEach(async (flight) => {
        const vatRate = 12 / 100;
        const totalTicketPrice = flight.passengers.reduce((total, passenger) => passenger.price + total, 0)
        
        const paymentDetails = [
            {amount: 1500, name: 'Fuel Surcharge', quantity: flight.passengers.length},
            {amount: 687.50, name: 'Passenger Service Charge', quantity: flight.passengers.length},
            {amount: 850, name: 'Terminal Fee', quantity: flight.passengers.length},
            {amount: 30, name: 'Aviation Security Fee', quantity: flight.passengers.length},
            {amount: vatRate * totalTicketPrice , name: 'VAT (12%) on Ticket Price', quantity: 1},
        ]
        flight.passengers.forEach(passenger=> {
            const item = {
                amount: passenger.price, 
                name: `${flight.destination}-${passenger.type} (${data.fareType} Tier)`, 
                quantity: 1
            }
            const isExist = paymentDetails.find(paymentDetail => paymentDetail.name === item.name)

            if(isExist){
                isExist.quantity += 1;
            }else{
                paymentDetails.push(item)
            }
        })
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
        total_amount: 1344,
        line_items: [
          {amount: 1344, name: 'Administration Fee', quantity: 1}
        ]
      })

      await adminFee.save();
}