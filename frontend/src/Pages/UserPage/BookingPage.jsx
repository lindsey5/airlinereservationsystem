import { useEffect, useState } from "react";
import '../../styles/BookingPage.css';
import { createPaymentLink } from "../../Service/paymentService";
import SeatSelection from "../../Components/Seats/SeatSelection";
import FareTypes from "../../Components/Booking/FareTypes";
import PassengerForm from "../../Components/Booking/PassengerForm";
import TermsModal from "../../Components/User/Modals/TermsModal";
import GetMaxPassengers from "../../utils/GetMaxPassengers";

const BookingPage = () => {
    const queryParams = new URLSearchParams(window.location.search); // Create a new URLSearchParams object to parse the query string from the current URL
    const encodedData = queryParams.get('data');  // Retrieve the value of the 'data' parameter from the query string
    const decodedData = JSON.parse(window.atob(decodeURIComponent(encodedData))); // Decode the retrieved value from the query from the url then parse to JSON
    const [currentFlightIndex, setCurrentFlightIndex] = useState(0); 
    const [bookings, setBookings] = useState();
    const [showForm, setShowForm] = useState(false);
    const [currentPassenger, setCurrentPassenger] = useState(0);
    const [passengersType, setPassengersType] = useState();
    const [showSeats, setShowSeats] = useState(false);
    const [fareType, setFareType] = useState();
    const [showTerms, setShowTerms] = useState(true);
    const [maximumPassengers, setMaximumPassengers] = useState();

    useEffect(() => {
        document.title = "Book Flight";
    },[])

    useEffect(() => {
        // Map the flights from decodedData 
        const flights = decodedData.flights.map(flight => ({
            id: flight.id, // Extract and keep the flight ID
            price: flight.price, // Extract and keep the flight price
            departure_country: flight.departure_country, // Extract and keep the departure country
            arrival_country: flight.arrival_country, // Extract and keep the arrival country
            destination: `${flight.departure_code} to ${flight.arrival_code}`, // Create a string representing the flight route (e.g., 'NYC to LON')
            passengers: [], // Initialize an empty array for passengers (assuming it will be populated later)
        }));

        // Create bookings object
        const bookingsObj = {
            flights,
            class: decodedData.class,
            child: 0, 
            adult: 0, 
            fareType: fareType
        }

        setBookings(bookingsObj) // Set the bookings object
    }, [fareType]) // Run this effect when the fareType state is changes

    useEffect(() => {
        // Check if 'bookings' data is available
        if (bookings) {
            const passengersType = []; // Initialize an empty array to store the passenger types
    
            // Loop through the number of adults and add 'Adult' to the passengersType array
            for (let i = 0; i < bookings.adult; i++) {
                passengersType.push('Adult');
            }
    
            // Loop through the number of children and add 'Child' to the passengersType array
            for (let i = 0; i < bookings.child; i++) {
                passengersType.push('Child');
            }
    
            // Update the state with the constructed array of passenger types
            setPassengersType(passengersType);

            const getMaxPassengers = async () => {
                setMaximumPassengers(GetMaxPassengers(JSON.parse(sessionStorage.getItem('flights')), decodedData.class))
            }

            getMaxPassengers();
        }
        
    
    }, [bookings]); // Run this effect whenever the 'bookings' state changes
    

    const handleBooking = async () => {
        if (confirm('Click ok to continue')) {
            // Check if the fare type is 'Bronze'
            if (fareType === 'Bronze') {
                // If fare type is 'Bronze', create a payment link for the booking
                const response = await createPaymentLink(bookings);
                
                // If the payment link is successfully created, redirect to the checkout page
                response ? 
                    window.location.href = response.data.attributes.checkout_url 
                    : // If the payment creation fails, alert the user
                    alert('Payment failed');
            } else {
                // If fare type is not 'Bronze', show the seat selection interface
                setCurrentPassenger(0); // Reset to the first passenger
                setShowSeats(true); // Set the state to show seat selection UI
            }
        }
    };
    

    const handleSelectedSeat = async (seatNumber) => {
        // Set the selected seat number for the current passenger on the current flight
        bookings.flights[currentFlightIndex].passengers[currentPassenger].seatNumber = seatNumber;
    
        // Check if the current passenger is the last one for the current flight
        if (bookings.flights[currentFlightIndex].passengers.length - 1 === currentPassenger) {
            
            // Check if the current flight is the last flight in the booking
            if (currentFlightIndex === bookings.flights.length - 1) {
                
                // If this is the last flight, create a payment link for the booking
                const response = await createPaymentLink(bookings);
    
                if (response) {
                    // If the payment link is successfully created, redirect to the checkout page
                    window.location.href = response.data.attributes.checkout_url;
                } else {
                    // If payment link creation failed, alert the user
                    alert('Payment failed');
                }
            } else {
                // Move to the next flight (if there are more flights in the booking)
                setCurrentFlightIndex(prev => prev + 1);
                // Reset the current passenger to 0 (first passenger on the next flight)
                setCurrentPassenger(0);
            }
        } else {
            // Move to the next passenger on the current flight
            setCurrentPassenger(prev => prev + 1);
        }
    };
    

    const handlePassengers = (e) => {
        e.preventDefault();
        if(passengersType.length > maximumPassengers){
            alert(`The Maximum passengers is ${maximumPassengers}`);
        }else{
        // Loop through each passenger type
        passengersType.forEach(passengerType => {
            // Loop through each flight in the decodedData.flights array
            decodedData.flights.forEach((flight, i)=> {
                let price = flight.price;
                // Adjust the price based on the selected fare type
                switch(fareType){
                    case 'Silver': 
                        price += 1120;
                        break;
                    case 'Gold':
                        price += 3000;
                }
                // Create a new passenger object with default values and updated price
                const passenger = {
                    firstname: '',
                    lastname: '',
                    dateOfBirth: '',
                    type: passengerType,
                    price: price,
                    nationality: '',
                    countryOfIssue: '',
                    request: '',
                    pwd: false,
                    fareType,
                    senior_citizen: false
                }
                bookings.flights[i].passengers.push(passenger) // Push the passenger object to the array
            })
        })
        setShowForm(true); // Set the state to true to show the passenger form interface
        }
    }

    return (
        <div className="booking-page">
            <div>
            <p>{decodedData.class}: </p>
            {decodedData && decodedData.flights.map((flight, i) => 
                <div key={i}>
                    <p>({flight.departure_code})</p>
                    <img src="/icons/airplane (1).png" alt="" />
                    <p>({flight.arrival_code})</p>
                </div>
            )}
            </div>
            {showTerms && <TermsModal setShowTerms={setShowTerms}/>}
            {!fareType && <FareTypes setFareType={setFareType}/>}
            {fareType && !showForm &&
            <form onSubmit={handlePassengers}>
            <div className="container">
                    <h2>Book Flight</h2>
                    <p>Maximum Passengers Allowed: {maximumPassengers}</p>
                    <div className="select-container">
                        <div className="select-div">
                            <label htmlFor="adult">Adult</label>
                            <select id="child" onChange={(e) => setBookings((prev) => {
                                    return { ...prev, adult: e.target.value}
                            })}>
                            {Array.from({ length: 21 }, (_, i) => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                            </select>
                            <p>(12+ years)</p>
                        </div>
                        <div className="select-div">
                            <label htmlFor="adult">Child</label>
                            <select id="child" onChange={(e) => setBookings((prev) => {
                                    return { ...prev, child: e.target.value}
                            })}>
                            {Array.from({ length: 21 }, (_, i) => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                            </select>
                            <p>(2-11 years)</p>
                        </div>
                    </div>
                    <button
                        className="next-btn"
                        type="submit"
                        disabled={bookings && bookings.adult == 0 || passengersType.length > maximumPassengers ? true : false}
                    >Next</button>
                </div>
                </form>}
                {showForm && 
                <PassengerForm
                    setCurrentPassenger={setCurrentPassenger}
                    currentPassenger={currentPassenger}
                    bookings={bookings}
                    setBookings={setBookings}
                    submit={handleBooking}
                />}
                { showSeats && 
                <SeatSelection 
                    bookings={bookings}
                    currentFlightIndex={currentFlightIndex}
                    currentPassenger={currentPassenger}
                    handleSelectedSeat={handleSelectedSeat}
                />}
        </div>
    )
}

export default BookingPage