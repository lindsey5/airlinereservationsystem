import { useEffect, useState } from "react";
import '../../styles/BookingPage.css';
import SeatSelection from "../../Components/Seats/SeatSelection";

const AdminBookingPage = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const encodedData = queryParams.get('data');
    const decodedData = JSON.parse(window.atob(decodeURIComponent(encodedData)));
    const [currentFlightIndex, setCurrentFlightIndex] = useState(0);
    const [bookings, setBookings] = useState();
    const [showForm, setShowForm] = useState(false);
    const [currentPassenger, setCurrentPassenger] = useState(0);
    const [passengersType, setPassengersType] = useState();
    const [showSeats, setShowSeats] = useState(false);
    const [selectSeat, setSelectSeat] = useState(false);
    const [bookedBy, setBookedBy] = useState({name: '', email: ''})

    const booking = (flights) =>  { 
        return {
            flights,
            class: decodedData.class,
            child: 0, 
            adult: 0, 
        }
    }

    useEffect(() => {
        setBookings(booking(decodedData.flights.map(flight => ({
            id: flight.id, price: 
            flight.price, 
            destination: `${flight.departure_code} to ${flight.arrival_code}`,
            passengers: []
        }
        ))))
    }, [])

    useEffect(() => {
        if(bookings){
            const passengersType = []

            for(let i = 0; i < bookings.adult; i++){
                passengersType.push('adult')
            }

            for(let i = 0; i < bookings.child; i++){
                passengersType.push('child')
            }
            setPassengersType(passengersType);
        }

    }, [bookings])

    const bookFlight = async() => {
        try{
            const response = await fetch('/api/flight/book/admin', {
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
                window.location.href = '/admin/flight/book'
            }else{
                alert('Book failed');
            }
        }catch(err){
            return null
        }
    }

    const handleBooking = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        decodedData.flights.forEach((flight, i)=> {
            const price = formData.get('type') === 'child' ? flight.price - (flight.price * 0.05) : flight.price;
            const passenger = {
                name: formData.get('name'),
                email: formData.get('email'),
                dateOfBirth: formData.get('dateOfBirth'),
                type: formData.get('type'),
                price: selectSeat ? price + 200 : price,
            }

            bookings.flights[i].passengers.push(passenger)
        })

        if(currentPassenger < passengersType.length  - 1){
            e.target.reset();
            setCurrentPassenger(prev => prev += 1)
        }else{
            if(!selectSeat){
                bookFlight();
            }else{
                setCurrentPassenger(0);
                setShowForm(false)
                setShowSeats(true);
            }
        }
    }

    const handleSelectedSeat = async (seatNumber) => {
        if(confirm('Click ok to continue')){
            bookings.flights[currentFlightIndex].passengers[currentPassenger].seatNumber = seatNumber;
            if(bookings.flights[currentFlightIndex].passengers.length - 1 === currentPassenger){
                if(currentFlightIndex === bookings.flights.length -1){
                    bookFlight();
                }else{
                    setCurrentFlightIndex(prev => prev + 1);
                    setCurrentPassenger(0);
                }
            }else{
                setCurrentPassenger(prev => prev + 1);
            }
        }
    }

    return (
        <div className="booking-page admin">
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
            <form onSubmit={(e) => {
                e.preventDefault();
                setShowForm(true);
            }}>
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
                    <div>
                        <input type="checkbox" onChange={()=> setSelectSeat(!selectSeat)}/> Select Seats (₱ 200 per seat)
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
                        disabled={(bookings && bookings.adult == 0) ? true : false}
                    >Next</button>
                </div>
            </form>
                { showForm && 
                    <div className="passenger-form-container">
                        <form onSubmit={handleBooking}>
                            <div className="passenger-form">
                                <input type="hidden" name="type" value={passengersType[currentPassenger]} />
                                <p>Passenger #{currentPassenger + 1} Information ({passengersType[currentPassenger]})</p>
                                <label>Name</label>
                                <input type="text" name="name" required/>
                                <label>Email</label>
                                <input type="email" name="email" required/>
                                <label>Date of Birth</label>
                                <input type="date" name="dateOfBirth" required/>
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                }
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

export default AdminBookingPage