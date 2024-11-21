import './FareTypes.css'

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
                    <h3>+ PHP 1120.00 / passenger</h3>
                    <p>Non-refundable</p>
                    <p>Limited Lounge Access</p>
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
                    <h3>+ PHP 3000.00 / passenger</h3>
                    <p>Fully refundable with no fees</p>
                    <p>Priority Check-in (skip the lines and check in faster with priority access)</p>
                    <p>Priority Baggage Handling (Get your checked baggage faster with priority baggage handling)</p>
                    <p>Premium In-Flight Amenities</p>
                    <p>Unlimited Lounge Access</p>
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