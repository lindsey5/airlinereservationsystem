import { useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';
import './Summary.css';

const PaymentSummary  = ({line_items, close, paymentDetails}) => {
    const [showTaxesAndFees, setShowTaxesAndFees] = useState(false);
    const [showFareDetails, setShowFareDetails] = useState(true);
    
    return (
        <div className="summary">
            <div className='summary-container'>
                <div className='header'>
                <h2>Payment Summary</h2>
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
                <button onClick={close}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default PaymentSummary