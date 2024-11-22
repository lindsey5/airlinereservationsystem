import { formatPrice } from '../../utils/formatPrice';
import './PaymentSummary.css';

const PaymentSummary  = ({line_items, close}) => {
    return (
        <div className="payment-summary">
            <div className='container'>
                <div className='header'>
                <h2>Payment Summary</h2>
                </div>
                <div className='items'>
                {line_items && line_items.map(item => 
                    <>
                    <p>{item.name}</p>
                    <p style={{textAlign: 'end'}}>{formatPrice(item.quantity * item.amount)}</p>
                    </>
                )}
                <h3>Total Amount</h3>
                <h3 style={{textAlign: 'end'}}>{line_items && formatPrice(line_items.reduce((total, item) => item.quantity * item.amount + total, 0))}</h3>
                </div>
                <div className='pay-btn-container'>
                <button onClick={close}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default PaymentSummary