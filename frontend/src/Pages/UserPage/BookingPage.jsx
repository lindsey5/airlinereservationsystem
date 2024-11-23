import { useEffect, useState } from "react";
import '../../styles/BookingPage.css';
import { createPaymentLink } from "../../Service/paymentService";
import SeatSelection from "../../Components/Seats/SeatSelection";
import FareTypes from "../../Components/Booking/FareTypes";
import PassengerForms from "../../Components/Booking/PassengerForms";

const BookingPage = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const encodedData = queryParams.get('data');
    const decodedData = JSON.parse(window.atob(decodeURIComponent(encodedData)));
    const [currentFlightIndex, setCurrentFlightIndex] = useState(0);
    const [bookings, setBookings] = useState();
    const [showForm, setShowForm] = useState(false);
    const [currentPassenger, setCurrentPassenger] = useState(0);
    const [passengersType, setPassengersType] = useState();
    const [showSeats, setShowSeats] = useState(false);
    const [fareType, setFareType] = useState();

    const booking = (flights) =>  { 
        return {
            flights,
            class: decodedData.class,
            child: 0, 
            adult: 0, 
            fareType: fareType
        }
    }

    useEffect(() => {
        document.title = "Book Flight";
    },[])

    useEffect(() => {
        setBookings(booking(decodedData.flights.map(flight => ({
            id: flight.id, 
            price: flight.price, 
            destination: `${flight.departure_code} to ${flight.arrival_code}`,
            passengers: [],
        }
        ))))
    }, [fareType])

    useEffect(() => {
        if(bookings){
            const passengersType = []

            for(let i = 0; i < bookings.adult; i++){
                passengersType.push('Adult')
            }

            for(let i = 0; i < bookings.child; i++){
                passengersType.push('Child')
            }
            setPassengersType(passengersType);
        }

    }, [bookings])

    const handleBooking = async () => {
        if(confirm('Click ok to continue')){
            if(fareType === 'Bronze'){
                const response = await createPaymentLink(bookings);
                response ? window.location.href = response.data.attributes.checkout_url : alert('Payment failed')
            }else{
                setCurrentPassenger(0);
                setShowSeats(true);
            }
        }
    }

    const handleSelectedSeat = async (seatNumber) => {
            bookings.flights[currentFlightIndex].passengers[currentPassenger].seatNumber = seatNumber;
            if(bookings.flights[currentFlightIndex].passengers.length - 1 === currentPassenger){
                if(currentFlightIndex === bookings.flights.length -1){
                    const response = await createPaymentLink(bookings);
                    if(response){
                        window.location.href = response.data.attributes.checkout_url;
                    }else{
                        alert('Payment failed')
                    }
                }else{
                    setCurrentFlightIndex(prev => prev + 1);
                    setCurrentPassenger(0);
                }
            }else{
                setCurrentPassenger(prev => prev + 1);
            }
    }

    const handlePassengers = (e) => {
        e.preventDefault();
        passengersType.forEach(passengerType => {
            decodedData.flights.forEach((flight, i)=> {
                let price = flight.price;
                switch(fareType){
                    case 'Silver': 
                        price += 1120;
                        break;
                    case 'Gold':
                        price += 3000;
                }

                const passenger = {
                    firstname: '',
                    lastname: '',
                    dateOfBirth: '',
                    type: passengerType,
                    price: passengerType === 'Child' ?  price - (price * 0.05) : price ,
                    nationality: '',
                    countryOfIssue: '',
                }
                bookings.flights[i].passengers.push(passenger)
            })
        })
        setShowForm(true);
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
            {!fareType && <FareTypes setFareType={setFareType}/>}
            {fareType && !showForm &&
            <form onSubmit={handlePassengers}>
            <div className="container">
                    <h2>Book Flight</h2>
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
                        disabled={bookings && bookings.adult == 0 ? true : false}
                    >Next</button>
                </div>
                </form>}
                {showForm && 
                <PassengerForms 
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