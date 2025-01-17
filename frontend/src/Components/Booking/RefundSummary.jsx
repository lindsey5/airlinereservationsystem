import { useState } from "react"
import { formatPrice } from "../../utils/formatPrice";
import { cancelPassengerFlight } from "../../Service/flightService";
import './Summary.css';
import useFetch from "../../hooks/useFetch";

const RefundSummary = ({flight, close, showError, setError}) => {
    const { data } = useFetch(`/api/payment?booking_id=${flight.booking_id}&&flight_id=${flight.id}`)
    const [showItems, setShowItems] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCancel = async (flight) => {
        setLoading(true);
        await cancelPassengerFlight({bookId: flight.booking_id, flightId: flight.id, showError, setError });
        setLoading(false);
    }
    return (
        <div className="summary">
            {loading && <div className="loader-container">
                <div className="loader"></div>
            </div>}
            <div className='summary-container'>
                <div className='header'>
                    <h2>Refund Summary</h2>
                </div>
                <div style={{padding: '0 15px'}}>
                    <p>Flight Number: {flight.flightNumber}</p>
                    <p>Booking Ref: {flight.bookingRef}</p>
                    <p>Payment Method: {flight.payment_method}</p>
                </div>
                {<div className='items-container'>
                    <div className='toggle-container'>
                        <p>Items to refund</p>
                        <button onClick={() => setShowItems(prev => !prev)}>
                        {showItems ? 'Hide' : 'Show'}
                        <img src={`/icons/${showItems ? 'up' : 'down'}.png`} alt="" />
                        </button>
                    </div>
                    {showItems && 
                        <div className='fare-details'>
                        {data && data.line_items.map(item => 
                            <>
                            <p>{item.name}</p>
                            <p style={{textAlign: 'end'}}>{formatPrice(item.quantity * item.amount)}</p>
                            </>
                        )}
                        </div>
                    }
                    <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 10px'}}>
                    <h3>Total Refund Amount</h3>
                    <h3 style={{textAlign: 'end'}}>{data && formatPrice(data.total_amount)}</h3>
                    </div>
                </div>}
                <div className='pay-btn-container'>
                <button onClick={() => handleCancel(flight)}>Cancel Flight</button>
                <button onClick={close}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default RefundSummary