import { useEffect, useState } from "react";
import '../../styles/BookingPage.css';
import SeatSelection from "../../Components/Seats/SeatSelection";
import FareTypes from "../../Components/Booking/FareTypes";
import PassengerForms from "../../Components/Booking/PassengerForms";

const FrontDeskBookingPage = () => {
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
    const [bookedBy, setBookedBy] = useState({
        name: '',
        email: ''
    })

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
        if(fareType === 'Bronze'){
            try{
                const response = await fetch('/api/flight/book/frontdesk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookings,
                        bookedBy,
                    })
                })
                if(response.ok){
                    window.location.href = '/frontdesk/flight/book'
                }else{
                    alert('Book failed');
                }
            }catch(err){
                console.log(err)
            }
        }else{
            setCurrentPassenger(0);
            setShowSeats(true);
        }
    }

    const handleSelectedSeat = async (seatNumber) => {
        if(confirm('Click ok to continue')){
            bookings.flights[currentFlightIndex].passengers[currentPassenger].seatNumber = seatNumber;
            if(bookings.flights[currentFlightIndex].passengers.length - 1 === currentPassenger){
                if(currentFlightIndex === bookings.flights.length -1){
                    try{
                        const response = await fetch('/api/flight/book/frontdesk', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                bookings,
                                bookedBy,
                            })
                        })
                        if(response.ok){
                            window.location.href = '/frontdesk/flights'
                        }else{
                            alert('Book failed');
                        }
                    }catch(err){
                        console.log(err)
                    }
                }else{
                    setCurrentFlightIndex(prev => prev + 1);
                    setCurrentPassenger(0);
                }
            }else{
                setCurrentPassenger(prev => prev + 1);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handlePassengers = (e) => {
        e.preventDefault();
        passengersType.forEach(passengerType => {
            decodedData.flights.forEach((flight, i)=> {
                let price = flight.price;
                switch(fareType){
                    case 'Silver': 
                        price += 1800;
                        break;
                }
                const passenger = {
                    firstname: '',
                    lastname: '',
                    dateOfBirth: '',
                    type: passengerType,
                    price: price,
                    nationality: '',
                    countryOfIssue: '',
                }
                bookings.flights[i].passengers.push(passenger)
            })
        })
        setShowForm(true);
    }

    return (
        <div className="booking-page frontdesk">
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
            {!fareType && <FareTypes setFareType={setFareType} frontDesk={true}/>}
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
                    <div className="input-container">
                        <div>
                        Booked By:
                        <input type="text" required value={bookedBy.name} onChange={(e) => setBookedBy(prev => ({...prev, name: e.target.value}))}/>
                        </div>
                        <div>
                        Email:
                        <input type="email" required value={bookedBy.email} onChange={(e) => setBookedBy(prev => ({...prev, email: e.target.value}))}/>
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
                    handleBooking={handleBooking}
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

export default FrontDeskBookingPage