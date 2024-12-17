import { useState } from "react"
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/dateUtils";

const PaymentDetails = ({payment, close}) => {
    const [showItems, setShowItems] = useState(true);

    return (
        <div className="summary">
            <div className='summary-container'>
                <div className='header'>
                    <h2>Payment Details</h2>
                </div>
                <div style={{padding: '0 15px'}}>
                    <p>Booking Ref: {payment.booking_ref}</p>
                    <p>Payment Date: {formatDate(payment.createdAt)}</p>
                </div>
                {<div className='items-container'>
                    <div className='toggle-container'>
                        <p>Items</p>
                        <button onClick={() => setShowItems(prev => !prev)}>
                        {showItems ? 'Hide' : 'Show'}
                        <img src={`/icons/${showItems ? 'up' : 'down'}.png`} alt="" />
                        </button>
                    </div>
                    {showItems && 
                        <div className='fare-details'>
                        {payment.line_items.map(item => 
                            <>
                            <p>{item.name}</p>
                            <p style={{textAlign: 'end'}}>{formatPrice(item.quantity * item.amount)}</p>
                            </>
                        )}
                        </div>
                    }
                    <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 10px'}}>
                    <h3>Total Amount</h3>
                    <h3 style={{textAlign: 'end'}}>{formatPrice(payment.total_amount)}</h3>
                    </div>
                </div>}
                <div className='pay-btn-container'>
                <button onClick={close}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default PaymentDetails