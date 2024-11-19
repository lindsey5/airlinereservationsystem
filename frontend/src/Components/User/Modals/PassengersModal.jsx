import { useEffect } from "react"
import './PassengersModal.css'
import { formatDate } from "../../../utils/dateUtils"

const PassengersModal = ({flight, close}) => {

    return(
        <div className="passengers-modal-container">
            {flight && 
            <div className="modal">
                <h4>Passengers: </h4>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Fullname</th>
                                <th>Seat</th>
                                <th>Class</th>
                                <th>Bronze</th>
                                <th>Silver</th>
                                <th>Gold</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            flight.passengers.map(passenger => 
                                <tr>
                                    <td>{passenger.firstname} {passenger.lastname}</td>
                                    <td>{passenger.seatNumber}</td>
                                    <td>{passenger.class}</td>
                                    <td>{passenger.fareType === 'Bronze' ? '✅' : '❌'}</td>
                                    <td>{passenger.fareType === 'Silver' ? '✅' : '❌'}</td>
                                    <td>{passenger.fareType === 'Gold' ? '✅' : '❌'}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
                <p>Flight No: {flight.flightNumber}</p>
                <p>Gate Number: {flight.gate_number}</p>
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

export default PassengersModal