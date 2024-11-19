import './FareTypes.css'
import { formatPrice } from '../../utils/formatPrice'

const FareTypes = ({setFareType}) => {
    return(
        <div className="fare-types-container">
            <div className='bronze'>
                <div>
                <h2>Bronze Tier</h2>
                <hr />
                <p>Non-refundable</p>
                <p>1 piece of hand-carry baggage (max 7kg)</p>
                <p>No seat selection</p>
                </div>
                <button onClick={() => setFareType('Bronze')}>Select Bronze</button>
            </div>
            <div className='silver'>
                <div>
                    <h2>Silver Tier</h2>
                    <hr />
                    <h3>+ {formatPrice(1800)} / passenger</h3>
                    <p>Not refundable</p>
                    <p>1 piece of hand-carry baggage (max 7kg)</p>
                    <p>1 checked baggage (max 20kg)</p>
                    <p>Preferred seat selection</p>
                </div>
                <button onClick={() => setFareType('Silver')}>Select Silver</button>
            </div>
            <div className='gold'>
                <div>
                    <h2>Gold Tier</h2>
                    <hr />
                    <h3>+ {formatPrice(3000)} / passenger</h3>
                    <p>Fully refundable with no fees</p>
                    <p>Rebooking allowed but change fee and fare difference may apply</p>
                    <p>1 piece of hand-carry baggage (max 7kg)</p>
                    <p>1 checked baggage (max 20kg)</p>
                    <p>Preferred seat selection</p>
                </div>
                <button onClick={() => setFareType('Gold')}>Select Gold</button>
            </div>
        </div>
    )
}

export default FareTypes