import './PassengersModal.css'
import { formatDate } from "../../../utils/dateUtils"
import { formatPrice } from '../../../utils/formatPrice'

const PassengersModal = ({flight, close}) => {

    console.log(flight)

    return(
        <div className="passengers-modal-container">
            {flight && 
            <div className="modal">
                <p>Flight No: {flight.flightNumber}</p>
                <p>Gate Number: {flight.gate_number}</p>
                <p>Booking Ref: {flight.bookingRef}</p>
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
                <h4>Passengers: </h4>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Fullname</th>
                                <th>Seat</th>
                                <th>Bronze</th>
                                <th>Silver</th>
                                <th>Gold</th>
                                <th>Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            flight.passengers.map(passenger => 
                                <tr>
                                    <td>{passenger.firstname} {passenger.lastname}</td>
                                    <td>{passenger.seatNumber}</td>
                                    <td>{passenger.fareType === 'Bronze' ? '✅' : '❌'}</td>
                                    <td>{passenger.fareType === 'Silver' ? '✅' : '❌'}</td>
                                    <td>{passenger.fareType === 'Gold' ? '✅' : '❌'}</td>
                                    <td>{formatPrice(passenger.price)}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                    <h3>Total Amount Paid:</h3>
                    <p>{formatPrice(flight.passengers.reduce((total, passenger) => passenger.price + total , 0))}</p>
                    <p>(Tax Excluded)</p>
                </div>
                <button onClick={close}>Close</button>
            </div>
            
            }
        </div>

    )
}

export default PassengersModal