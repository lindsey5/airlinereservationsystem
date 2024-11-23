import { useEffect, useState } from "react"
import { formatPrice } from "../../utils/formatPrice";
import { cancelFlight } from "../../Service/flightService";
import './Summary.css';

const RefundSummary = ({flight, close, showError}) => {
    const [line_items, set_line_items] = useState();
    const [paymentDetails, setPaymentDetails] = useState();
    const [showTaxesAndFees, setShowTaxesAndFees] = useState(false);
    const [showFareDetails, setShowFareDetails] = useState(true);

    useEffect(() => {
        const vatRate = 12 / 100;
        const totalTicketPrice = flight.passengers.reduce((total, passenger) => 
            total + ((passenger.pwd || passenger.senior_citizen) 
            && flight.departure_country === 'Philippines' 
            && flight.arrival_country === 'Philippines' ? 0 : passenger.price)
        , 0)

        const fareDetails = [];
            flight.passengers.forEach(passenger => {
                const isDiscounted = (passenger.pwd || passenger.senior_citizen) 
                && flight.departure_country === 'Philippines' 
                && flight.arrival_country === 'Philippines';
                const fareAmount = isDiscounted ? passenger.price * 0.80 : passenger.price;
                const item = {
                    currency: 'PHP',
                    amount: fareAmount, 
                    name: `${flight.departure.airport_code} to ${flight.arrival.airport_code}-${passenger.type} (${flight.fareType} Tier)`,
                    quantity: 1
                };
                fareDetails.push(item); 
            });
        const taxesAndFees = [
            {currency: 'PHP', amount: 523, name: 'Fuel Surcharge', quantity: flight.passengers.length},
            {currency: 'PHP', amount: 450, name: 'Passenger Service Charge', quantity: flight.passengers.length},
            {currency: 'PHP', amount: 900, name: 'Terminal Fee', quantity: flight.passengers.length},
            {currency: 'PHP', amount: 30, name: 'Aviation Security Fee', quantity: flight.passengers.length},
        ];
        const line_items = [];
        if(vatRate * totalTicketPrice){
            taxesAndFees.push({currency: 'PHP', amount: vatRate * totalTicketPrice , name: 'VAT (12%) on base fare', quantity: 1})
        }
        console.log(taxesAndFees)
        line_items.push({currency: 'PHP', amount: taxesAndFees.reduce((total, fee) => total + (fee.amount * fee.quantity), 0), name: 'Taxes and Fees'})
        line_items.push({currency: 'PHP', amount: fareDetails.reduce((total, fare) => fare.amount + total ,0), name: 'Fares'})
        
        setPaymentDetails({taxesAndFees, fareDetails})
        set_line_items(line_items);
        console.log(flight)
    },[flight])

    return (
        <div className="summary">
            <div className='container'>
                <div className='header'>
                    <h2>Refund Summary</h2>
                </div>
                <div style={{padding: '0 15px'}}>
                    <p>Flight Number: {flight.flightNumber}</p>
                    <p>Booking Ref: {flight.bookingRef}</p>
                </div>
                <div className='items-container'>
                    <div className='toggle-container'>
                        <p>{line_items && line_items[1].name}</p>
                        <button onClick={() => setShowFareDetails(prev => !prev)}>
                        {showFareDetails ? 'Hide' : 'Show'}
                        <img src={`/icons/${showFareDetails ? 'up' : 'down'}.png`} alt="" />
                        </button>
                    </div>
                    {showFareDetails && 
                        <div className='fare-details'>
                        {paymentDetails && paymentDetails?.fareDetails.map(fare => 
                            <>
                            <p>{fare.name}</p>
                            <p style={{textAlign: 'end'}}>{formatPrice(fare.quantity * fare.amount)}</p>
                            </>
                        )}
                        <h4>Subtotal</h4>
                        <h4 style={{textAlign: 'end'}}>{formatPrice(paymentDetails?.fareDetails.reduce((total, fareDetail) => total + fareDetail.amount, 0))}</h4>
                        </div>
                    }
                    <div className='toggle-container'>
                        <p>{line_items && line_items[0].name}</p>
                        <button onClick={() => setShowTaxesAndFees(prev => !prev)}>
                        {showTaxesAndFees ? 'Hide' : 'Show'}
                        <img src={`/icons/${showTaxesAndFees ? 'up' : 'down'}.png`} alt="" />
                        </button>
                    </div>
                    {showTaxesAndFees && 
                        <div className='taxes-and-fees'>
                        {paymentDetails && paymentDetails.taxesAndFees.map(fee => 
                            <>
                            <p>{fee.name}</p>
                            <p style={{textAlign: 'end'}}>{formatPrice(fee.quantity * fee.amount)}</p>
                            </>
                        )}
                        <h4>Subtotal</h4>
                        <h4 style={{textAlign: 'end'}}>{formatPrice(paymentDetails.taxesAndFees.reduce((total, fee) => total + fee.amount, 0))}</h4>
                        </div>
                    }
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 10px'}}>
                <h3>Total Amount</h3>
                <h3 style={{textAlign: 'end'}}>{line_items && formatPrice(line_items.reduce((total, item) => item.amount + total, 0))}</h3>
                </div>
                </div>
                <div className='pay-btn-container'>
                <button onClick={() => cancelFlight({bookId: flight.bookingRef, flightId: flight.id, showError })}>Cancel Flight</button>
                <button onClick={close}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default RefundSummary