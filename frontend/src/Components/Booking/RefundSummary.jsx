import { useEffect, useState } from "react"
import { formatPrice } from "../../utils/formatPrice";
import { cancelFlight } from "../../Service/flightService";
import './Summary.css';

const RefundSummary = ({flight, close, showError}) => {
    const [items, setItems] = useState();

    useEffect(() => {
        const vatRate = 12 / 100;
        const totalTicketPrice = flight.passengers.reduce((total, passenger) => total + passenger.price, 0)
        const line_items = [
            {amount: 1500, name: 'Fuel Surcharge', quantity: flight.passengers.length},
            {amount: 687.50, name: 'Passenger Service Charge', quantity: flight.passengers.length},
            {amount: 850, name: 'Terminal Fee', quantity: flight.passengers.length},
            {amount: 30, name: 'Aviation Security Fee', quantity: flight.passengers.length},
        ]

        flight.passengers.forEach(passenger => {
            const name = `${flight.departure.airport_code} to ${flight.arrival.airport_code}-${passenger.type} (${flight.fareType})`;
            const index = line_items.findIndex(item => item.name === name)
            if(index < 0){
                line_items.push({
                    amount: passenger.price,
                    quantity: 1,
                    name
                })
            }else{
                line_items[index].quantity += 1;
            }
        })
        line_items.push({amount: vatRate * totalTicketPrice , name: 'VAT (12%) on Ticket Price', quantity: 1})
        setItems(line_items);
    },[flight])

    return (
        <div className="summary">
            <div className="container">
                <div className='header'>
                <h2>Refund Summary</h2>
                </div>
                <div style={{padding: '0 15px'}}>
                    <p>Flight Number: {flight.flightNumber}</p>
                    <p>Booking Ref: {flight.bookingRef}</p>
                </div>
                <div className='items-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Item Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                        {items && items.map(item => 
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{Math.round(item.amount * 100) / 100}</td>
                            <td>{Math.round(item.quantity * item.amount * 100) / 100}</td>
                        </tr>
                        )}
                        </tbody>
                </table>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 10px'}}>
                <h3>Total Amount</h3>
                <h3 style={{textAlign: 'end'}}>{items && formatPrice(items.reduce((total, item) => item.quantity * item.amount + total, 0))}</h3>
                </div>
                </div>
                <div className='pay-btn-container'>
                    <button onClick={() => cancelFlight({
                        bookId: flight.bookingRef,
                        flightId: flight.id,
                        showError
                    })}>Cancel Flight</button>
                    <button onClick={close}>Close</button>
                </div>
            </div>
        </div>
    )

}

export default RefundSummary