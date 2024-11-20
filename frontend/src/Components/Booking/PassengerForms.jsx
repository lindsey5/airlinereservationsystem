import { useState, useEffect } from 'react';
import './PassengerForms.css';

const PassengerForms = ({setCurrentPassenger, currentPassenger, bookings, setBookings, handleBooking}) => {
    const [isValid, setIsValid] = useState(false);

    const setPassengerDetail = (e, type) => {
        e.preventDefault();
        setBookings(prev => {
            const flights = prev.flights;
            flights.forEach(flight => {
                flight.passengers[currentPassenger][type] = e.target.value;
            });
            return { ...prev, flights };
        });
    };

    useEffect(() => {
        let flag = true;
        for (let flight of bookings.flights) {
            for (let passenger of flight.passengers) {
                if (!passenger.firstname || !passenger.lastname || !passenger.dateOfBirth ||
                    !passenger.nationality || !passenger.countryOfIssue) {
                    flag = false;
                    break;
                }
            }
            if (!flag) break;
        }
        setIsValid(flag)
    },[bookings])

    return(
        <div className="passenger-forms">
            <div className='container'>
                <h1>Passenger Details</h1>
                <div className='passenger-details-container'>
                    <div className='side-bar'>
                    {Array.from({ length: bookings.flights[0].passengers.length }, (_, i) => (
                        <button 
                            key={i}
                            className={currentPassenger === i ? 'selected' : ''} 
                            onClick={() => setCurrentPassenger(i)}
                            type='button'
                        >Passenger {i+1} ({bookings.flights[0].passengers[i].type})</button>
                    ))}
                    </div>
                    <div className='passenger-details'>
                        <div>
                            <h2>{bookings.fareType} Tier</h2>
                            <div>
                            {bookings.flights.map(flight => 
                                <p key={flight.destination}>{flight.destination} ✈</p>
                            )}
                            </div>
                        </div>
                        <hr />
                        <div>
                            Name
                            <p>Please make sure that you enter your name exactly as it is shown on your Valid ID</p>
                            <div className='name-container'>
                                <div>
                                    Firstname
                                    <input type="text" 
                                    value={bookings.flights[0].passengers[currentPassenger].firstname || ''}
                                    onChange={(e) => setPassengerDetail(e, 'firstname')}/>
                                </div>
                                <div>
                                    Lastname
                                    <input type="text" 
                                    value={bookings.flights[0].passengers[currentPassenger].lastname || ''}
                                    onChange={(e) => setPassengerDetail(e, 'lastname')}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            Date of Birth
                            <input 
                                type="date" 
                                onChange={(e) => setPassengerDetail(e, 'dateOfBirth')}
                                value={bookings.flights[0].passengers[currentPassenger].dateOfBirth || ''}
                            />
                        </div>
                        <div>
                            Nationality
                            <input 
                            type="text" value={bookings.flights[0].passengers[currentPassenger].nationality || ''}
                            onChange={(e) => setPassengerDetail(e, 'nationality')}/>
                        </div>
                        <div>
                            Country of Issue
                            <input 
                            type="text" value={bookings.flights[0].passengers[currentPassenger].countryOfIssue}
                            onChange={(e) => setPassengerDetail(e, 'countryOfIssue')}
                            />
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleBooking}
                    className='book-btn' 
                    type='submit' disabled={isValid ? false : true}
                >Book Flight</button>
            </div>
        </div>
    )
}

export default PassengerForms;