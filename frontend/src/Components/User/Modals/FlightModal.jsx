import './FlightModal.css'
import { formatDate } from "../../../utils/dateUtils"

const FlightModal = ({flight, close}) => {

    return(
        <div className="passengers-modal-container">
            {flight && 
            <div className="modal">
                <div>
                    <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                    <h3>CLOUDPEAK <span>AIRLINES</span></h3>
                </div>
                <p>Flight No: {flight.flightNumber}</p>
                <p>Gate Number: {flight.gate_number}</p>
                <p>Booking Ref: {flight.bookingRef}</p>
                <p>Airplane Code: {flight.airplane}</p>
                <p>{flight.fareType} Tier</p>
                <p>{flight.class} Class</p>
                <div className="passengers-destination">
                    <div>
                        <p>Departure:</p>
                        <p>{flight.departure.city}, {flight.departure.country}</p>
                        <p>{flight.departure.airport} ({flight.departure.airport_code})</p>
                        <p>{formatDate(flight.departure.time)}</p>
                    </div>
                    <div>
                        <p>Arrival:</p>
                        <p>{flight.arrival.city}, {flight.arrival.country}</p>
                        <p>{flight.arrival.airport} ({flight.arrival.airport_code})</p>
                        <p>{formatDate(flight.arrival.time)}</p>
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button 
                        onClick={() => window.open(`/tickets?data=${flight.booking_id}&&f=${flight.id}`, 'blank')}
                        className='view-tickets'
                    >View Tickets</button>
                </div>
                <button onClick={close}>Close</button>
            </div>
            
            }
        </div>

    )
}

export default FlightModal