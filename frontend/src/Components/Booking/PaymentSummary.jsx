import { formatPrice } from '../../utils/formatPrice';
import './Summary.css';

const PaymentSummary  = ({line_items, close}) => {
    return (
        <div className="summary">
            <div className='container'>
                <div className='header'>
                <h2>Payment Summary</h2>
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
                        {line_items && line_items.map(item => 
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
                <h3 style={{textAlign: 'end'}}>{line_items && formatPrice(line_items.reduce((total, item) => item.quantity * item.amount + total, 0))}</h3>
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