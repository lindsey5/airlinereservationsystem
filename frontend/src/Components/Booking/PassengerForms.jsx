import { useState, useEffect } from 'react';
import './PassengerForms.css';
import PaymentSummary from './PaymentSummary';

const PassengerForms = ({setCurrentPassenger, currentPassenger, bookings, setBookings, submit}) => {
    const [isValid, setIsValid] = useState(false);
    const [showSummary, setShowSummary] = useState(true);
    const [lineItems, setLineItems] = useState();
    const [paymentDetails, setPaymentDetails] = useState();

    const handlePaymentSummary = () => {
        const vatRate = 12 / 100;
        const totalTicketPrice = bookings.flights.reduce((total, flight) => {
            return total + flight.passengers.reduce((total, passenger) => 
                total + ((passenger.pwd || passenger.senior_citizen) 
                && flight.departure_country === 'Philippines' 
                && flight.arrival_country === 'Philippines' ? 0 : passenger.price)
            , 0)
        }, 0)

        const fareDetails = [];
        bookings.flights.forEach(flight => {
            flight.passengers.forEach(passenger => {
                const isDiscounted = (passenger.pwd || passenger.senior_citizen) 
                && flight.departure_country === 'Philippines' 
                && flight.arrival_country === 'Philippines';
                const fareAmount = isDiscounted ? passenger.price * 0.80 : passenger.price;
                const item = {
                    currency: 'PHP',
                    amount: fareAmount, 
                    name: `${flight.destination}-${passenger.type} (${bookings.fareType} Tier)`,
                    quantity: 1
                };
                fareDetails.push(item); 
            });
        });
        const taxesAndFees = [
            {currency: 'PHP', amount: 523, name: 'Fuel Surcharge', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 450, name: 'Passenger Service Charge', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 900, name: 'Terminal Fee', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 30, name: 'Aviation Security Fee', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 400, name: 'Administration Fee', quantity: 1},
        ];
        const line_items = [];
        if(vatRate * totalTicketPrice){
            taxesAndFees.push({currency: 'PHP', amount: vatRate * totalTicketPrice , name: 'VAT (12%) on base fare', quantity: 1})
        }
        console.log(taxesAndFees)
        line_items.push({currency: 'PHP', amount: taxesAndFees.reduce((total, fee) => total + (fee.amount * fee.quantity), 0), name: 'Taxes and Fees'})
        line_items.push({currency: 'PHP', amount: fareDetails.reduce((total, fare) => fare.amount + total ,0), name: 'Fares'})
        
        bookings.line_items = [...taxesAndFees, ...fareDetails]
        setPaymentDetails({taxesAndFees, fareDetails})
        setLineItems(line_items);
    }

    const setPassengerDetails = (e, type) => {
        e.preventDefault();
        setBookings(prev => {
            const updatedFlights = prev.flights.map(flight => {
              const updatedPassengers = flight.passengers.map((passenger, idx) => {
                if (idx === currentPassenger) {
                  return { ...passenger, [type]: e.target.value };
                }
                return passenger;
              });
              return { ...flight, passengers: updatedPassengers };
            });
            return { ...prev, flights: updatedFlights };
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

        setIsValid(flag);
        handlePaymentSummary();
    },[bookings])

    const handleToggle = (type) =>{
        setBookings(prev => {
            const updatedFlights = prev.flights.map(flight => {
              const updatedPassengers = flight.passengers.map((passenger, idx) => {
                if (idx === currentPassenger) {
                  return { ...passenger, [type]: !passenger[type]};
                }
                return passenger;
              });
              return { ...flight, passengers: updatedPassengers };
            });
            return { ...prev, flights: updatedFlights };
          })
    }

    return(
        <div className="passenger-forms">
            {showSummary && <PaymentSummary line_items={lineItems} close={() => setShowSummary(false)} paymentDetails={paymentDetails}/>}
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
                                    onChange={(e) => setPassengerDetails(e, 'firstname')}/>
                                </div>
                                <div>
                                    Lastname
                                    <input type="text" 
                                    value={bookings.flights[0].passengers[currentPassenger].lastname || ''}
                                    onChange={(e) => setPassengerDetails(e, 'lastname')}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            Date of Birth
                            <input 
                                type="date" 
                                onChange={(e) => setPassengerDetails(e, 'dateOfBirth')}
                                value={bookings.flights[0].passengers[currentPassenger].dateOfBirth || ''}
                            />
                        </div>
                        <div>
                            Nationality
                            <input 
                            type="text" value={bookings.flights[0].passengers[currentPassenger].nationality || ''}
                            onChange={(e) => setPassengerDetails(e, 'nationality')}/>
                        </div>
                        <div>
                            Country of Issue
                            <input 
                            type="text" value={bookings.flights[0].passengers[currentPassenger].countryOfIssue}
                            onChange={(e) => setPassengerDetails(e, 'countryOfIssue')}
                            />
                        </div>
                        <div>
                            Request
                            <textarea 
                                value={bookings.flights[0].passengers[currentPassenger].request}
                                onChange={e => setPassengerDetails(e, 'request')}>
                            </textarea>
                        </div>
                        <div>
                            <div className='checkbox-container'>
                                <input type="checkbox" 
                                checked={bookings.flights[0].passengers[currentPassenger].pwd}
                                onChange={() =>{
                                    handleToggle('pwd')
                                }}/>I am a person with disability
                            </div><div className='checkbox-container'>
                                <input type="checkbox" 
                                checked={bookings.flights[0].passengers[currentPassenger].senior_citizen}
                                onChange={() =>{
                                    handleToggle('senior_citizen')
                                }}/>I am a senior citizen
                            </div>
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