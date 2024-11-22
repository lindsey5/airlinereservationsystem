import './FlightModal.css'
import { formatDate } from "../../../utils/dateUtils"
import { formatPrice } from '../../../utils/formatPrice'
import { useNavigate } from 'react-router-dom'

const FlightModal = ({flight, close}) => {
    const navigate = useNavigate();

    const utf8ToBase64 = (str) => {
        // Create a UTF-8 encoded byte array from the string
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(str);
    
        // Convert the byte array to a Base64 encoded string
        let binary = '';
        uint8Array.forEach(byte => binary += String.fromCharCode(byte));
        return btoa(binary);
    }

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
                <button onClick={close}>Close</button>
            </div>
            
            }
        </div>

    )
}

export default FlightModal