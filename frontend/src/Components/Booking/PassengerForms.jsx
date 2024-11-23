import { useState, useEffect } from 'react';
import './PassengerForms.css';
import PaymentSummary from './PaymentSummary';

const PassengerForms = ({setCurrentPassenger, currentPassenger, bookings, setBookings, submit}) => {
    const [isValid, setIsValid] = useState(false);
    const [showSummary, setShowSummary] = useState(true);
    const [lineItems, setLineItems] = useState();

    const handlePaymentSummary = () => {
        const vatRate = 12 / 100;
        const totalTicketPrice = bookings.flights.reduce((total, flights) => {
            return total + flights.passengers.reduce((total, passenger) => total + passenger.price, 0)
        }, 0)
        const line_items = [
            {amount: 1500, name: 'Fuel Surcharge', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {amount: 687.50, name: 'Passenger Service Charge', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {amount: 850, name: 'Terminal Fee', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {amount: 30, name: 'Aviation Security Fee', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {amount: 1344, name: 'Administration Fee', quantity: 1},
        ];
        bookings.flights.forEach(flight => {
            flight.passengers.forEach(passenger=> {
                const item = {
                    currency: 'PHP',
                    amount: passenger.price, 
                    name: `${flight.destination}-${passenger.type} (${bookings.fareType} Tier)`, 
                    quantity: 1
                }
                const isExist = line_items.find(line_item => line_item.name === item.name)

                if(isExist){
                    isExist.quantity += 1;
                }else{
                    line_items.push(item)
                }
            })
        })
        line_items.push({amount: vatRate * totalTicketPrice , name: 'VAT (12%) on Ticket Price', quantity: 1})
        setLineItems(line_items);
    }

    useEffect(() => {
        handlePaymentSummary();
    }, [bookings])

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
            {showSummary && <PaymentSummary line_items={lineItems} close={() => setShowSummary(false)}/>}
            <div className='container'>
                <div>
                <h1>Passenger Details</h1>
                <button className='payment-summary-btn' onClick={() => setShowSummary(true)}>Show Payment Summary</button>
                </div>
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
                    onClick={submit}
                    className='book-btn' 
                    type='submit' disabled={isValid ? false : true}
                >Book Flight</button>
            </div>
        </div>
    )
}

export default PassengerForms;