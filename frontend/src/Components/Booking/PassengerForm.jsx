import { useState, useEffect } from 'react';
import './PassengerForm.css';
import PaymentSummary from './PaymentSummary';
import { formatDate2 } from '../../utils/dateUtils';

const PassengerForms = ({setCurrentPassenger, currentPassenger, bookings, setBookings, submit}) => {
    const [isValid, setIsValid] = useState(false);
    const [showSummary, setShowSummary] = useState(true);
    const [lineItems, setLineItems] = useState();
    const [paymentDetails, setPaymentDetails] = useState();
    const [isAgreed, setIsAgreed] = useState(false);
    const today = new Date();

    const handlePaymentSummary = () => {
        // Define the VAT rate (12%)
        const vatRate = 12 / 100;
    
        // Calculate the total ticket price by summing up the prices of all passengers
        const totalTicketPrice = bookings.flights.reduce((total, flight) => {
            return total + flight.passengers.reduce((total, passenger) =>
                total + (
                    // Apply discount if the passenger is a person with disability (PWD) or senior citizen
                    // and the flight's departure and arrival are in the Philippines, and the fare is not 'First'
                    (passenger.pwd || passenger.senior_citizen) 
                    && flight.departure_country === 'Philippines' 
                    && bookings.class !== 'First'
                    && flight.arrival_country === 'Philippines' 
                    ? 0  // If conditions are met, the fare is waived (set to 0)
                    : passenger.price  // Otherwise, use the passenger's price
                )
            , 0)
        }, 0);
    
        // Initialize an empty array to store fare details for each passenger
        const fareDetails = [];
    
        // Loop through each flight and passenger to prepare fare details for each item
        bookings.flights.forEach(flight => {
            flight.passengers.forEach(passenger => {
                // Check if the passenger qualifies for a discount (PWD or senior citizen in the Philippines)
                const isDiscounted = (passenger.pwd || passenger.senior_citizen) 
                    && flight.departure_country === 'Philippines' 
                    && flight.arrival_country === 'Philippines' 
                    && bookings.class !== 'First';
    
                // Apply a 20% discount if the passenger qualifies for the discount
                const fareAmount = isDiscounted ? passenger.price * 0.80 : passenger.price;
    
                // Create an item object for this passenger's fare
                const item = {
                    currency: 'PHP', // Currency is PHP (Philippine Peso)
                    amount: fareAmount, // Amount after any discounts
                    name: `${flight.destination}-${passenger.type} (${bookings.fareType} Tier)`, // Description of the fare
                    quantity: 1 // Only 1 ticket per passenger
                };
                fareDetails.push(item); // Add the item to the fare details array
            });
        });
    
        // Define the taxes and fees that will be added to the booking
        const taxesAndFees = [
            {currency: 'PHP', amount: 523, name: 'Fuel Surcharge', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 450, name: 'Passenger Service Charge', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 900, name: 'Terminal Fee', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 30, name: 'Aviation Security Fee', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 400, name: 'Administration Fee', quantity: 1},
        ];
    
        // Create an array to store the line items for the payment summary
        const line_items = [];
    
        // If the total ticket price is greater than zero, calculate the VAT and add it to the taxes and fees
        if (vatRate * totalTicketPrice) {
            taxesAndFees.push({
                currency: 'PHP', 
                amount: vatRate * totalTicketPrice,  // VAT amount based on the total ticket price
                name: 'VAT (12%) on base fare', // Name of the tax
                quantity: 1
            });
        }
    
        // Add the taxes and fees as a line item
        line_items.push({
            currency: 'PHP', 
            amount: taxesAndFees.reduce((total, fee) => total + (fee.amount * fee.quantity), 0), // Total taxes and fees
            name: 'Taxes and Fees'
        });
    
        // Add the fare details as a line item
        line_items.push({
            currency: 'PHP', 
            amount: fareDetails.reduce((total, fare) => fare.amount + total, 0), // Total fares
            name: 'Fares'
        });
    
        // Combine taxes, fees, and fare details into the line items array
        bookings.line_items = [...taxesAndFees, ...fareDetails];
    
        // Set the state for taxes and fees, fare details, and line items
        setPaymentDetails({taxesAndFees, fareDetails});
        setLineItems(line_items);
    };    

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
        // check if all passengers in all flights have valid information
        const isValid = bookings.flights.every(flight =>
            flight.passengers.every(passenger =>
                passenger.firstname &&
                passenger.lastname &&
                passenger.dateOfBirth &&
                passenger.nationality &&
                passenger.countryOfIssue
            ) 
        ) && isAgreed;
    
        // Set the validity state based on the result
        setIsValid(isValid);
    
        // Always call handlePaymentSummary
        handlePaymentSummary();
    }, [bookings, isAgreed]); // Run this effect whenever 'bookings' changes

    return(
        <div className="passenger-form">
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
                                max={bookings.flights[0].passengers[currentPassenger].type === 'Adult' ? 
                                    formatDate2(new Date(today.setFullYear(today.getFullYear() - 12))) : 
                                    formatDate2(new Date(today.setFullYear(today.getFullYear() - 2)))}
                                min={bookings.flights[0].passengers[currentPassenger].type !== 'Adult' && formatDate2(new Date(today.setFullYear(today.getFullYear() - 11)))}
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
                            Request (optional)
                            <textarea 
                                value={bookings.flights[0].passengers[currentPassenger].request}
                                onChange={e => setPassengerDetails(e, 'request')}>
                            </textarea>
                        </div>
                        <div>
                            <p>For Domestic Flights, 20% Discount and tax exemption if PWD or senior citizen</p>
                            <div className='checkbox-container'>
                                <input type="checkbox" name="discount"
                                checked={bookings.flights[0].passengers[currentPassenger].pwd}
                                onClick={() =>{
                                    setBookings(prev => {
                                        const updatedFlights = prev.flights.map(flight => {
                                          const updatedPassengers = flight.passengers.map((passenger, idx) => {
                                            if (idx === currentPassenger) {
                                            
                                              return { ...passenger, pwd: !passenger.pwd, senior_citizen: false};
                                            }
                                            return passenger;
                                          });
                                          return { ...flight, passengers: updatedPassengers };
                                        });
                                        return { ...prev, flights: updatedFlights };
                                      })
                                }}/>
                                I am a person with disability
                            </div>
                            <div className='checkbox-container'>
                                <input type="checkbox" name="discount"
                                checked={bookings.flights[0].passengers[currentPassenger].senior_citizen}
                                onClick={() =>{
                                    setBookings(prev => {
                                        const updatedFlights = prev.flights.map(flight => {
                                          const updatedPassengers = flight.passengers.map((passenger, idx) => {
                                            if (idx === currentPassenger) {
                                            
                                              return { ...passenger, pwd: false, senior_citizen: !passenger.senior_citizen};
                                            }
                                            return passenger;
                                          });
                                          return { ...flight, passengers: updatedPassengers };
                                        });
                                        return { ...prev, flights: updatedFlights };
                                      })
                                }}/>
                                I am a senior citizen
                            </div>
                        </div>
                    </div>
                </div>
                <div className='checkbox-container last'>
                            <input type="checkbox" onClick={() => setIsAgreed(prev => !prev)}/>
                            I have read and agreed to CloudPeak <a href="/privacy-policy" target="_blank">Privacy Policy</a>
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