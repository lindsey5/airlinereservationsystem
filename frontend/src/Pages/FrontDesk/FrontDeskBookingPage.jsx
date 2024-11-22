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
    const [email, setEmail] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [lineItems, setItems] = useState();

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

    const handleBooking = async (e) => {
        e.preventDefault();
        const line_items = [
            {currency: 'PHP', amount: 1500, name: 'Fuel Surcharge', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 687.50, name: 'Passenger Service Charge', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 850, name: 'Terminal Fee', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 30, name: 'Aviation Security Fee', quantity: bookings.flights.length * bookings.flights[0].passengers.length},
            {currency: 'PHP', amount: 1344, name: 'Administration Fee', quantity: 1},
            {currency: 'PHP', amount: 600, name: 'VAT', quantity: bookings.flights.length * bookings.flights[0].passengers.length}
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


        console.log(line_items)
        /*if(fareType === 'Bronze'){
            try{
                const response = await fetch('/api/flight/book/frontdesk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bookings, email})
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
        }*/
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
                            body: JSON.stringify({ bookings, email })
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
            window.scrollTo(0, 0);
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
                        Passenger Email:
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
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