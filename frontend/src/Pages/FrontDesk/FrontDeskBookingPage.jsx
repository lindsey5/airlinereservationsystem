import { useEffect, useState } from "react";
import '../../styles/BookingPage.css';
import SeatSelection from "../../Components/Seats/SeatSelection";
import FareTypes from "../../Components/Booking/FareTypes";
import PassengerForm from "../../Components/Booking/PassengerForm";
import jsPDF from 'jspdf'
import { formatDate } from "../../utils/dateUtils";
import GetMaxPassengers from "../../utils/GetMaxPassengers";
import formatPrice from "../../../../backend/utils/formatPrice";

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
    const [maximumPassengers, setMaximumPassengers] = useState();
    const [loading, setLoading] = useState(false);

    const generateReceipt = (booking_ref) => {
        const initialPageHeight = 220;  
        const doc = new jsPDF({
            unit: 'mm',
            format: [80, initialPageHeight]
        });
    
        doc.setFontSize(15);
        doc.text('Customer Receipt', 40, 10, null, null, 'center');
        doc.setFontSize(8);
        doc.text('CloudPeak Airlines', 40, 20, null, null, 'center');
        doc.text('cloudpeakairlines@gmail.com', 40, 25, null, null, 'center');
        let yPosition = 35;  // Initial yPosition after title
        const margin = 10;
        const lineHeight = 10;  // Space between lines
        const itemWidth = 60;  // Width for price column
    
        // Helper function to track the total content height
        const getContentHeight = () => yPosition + lineHeight;
    
        // Track total height needed
        let totalHeight = getContentHeight();
        doc.setFontSize(7);
        // Add the static content (Date and Booking Reference)
        doc.text(`Date: ${formatDate(new Date())}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Booking Ref: ${booking_ref}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Customer Email: ${email}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Number of Passenger(s): ${passengersType.length}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Fare Type: ${fareType} Tier`, margin, yPosition);
        yPosition += lineHeight + 5;

        doc.setFontSize(6);
        doc.text('Items', margin, yPosition);
        doc.text('Price', itemWidth, yPosition);
        yPosition += lineHeight;
    
        // Calculate the total height after adding items
        bookings.line_items.forEach(item => {
            // Check if we need to adjust the page height dynamically
            if (getContentHeight() > doc.internal.pageSize.height) {
                // Increase the page height by 20mm
                const newHeight = doc.internal.pageSize.height + 20;  // Increase by 20mm (or more if necessary)
                doc.internal.pageSize.height = newHeight;  // Update internal page height
            }
    
            // Add item to receipt
            doc.text(`${item.name} (${item.quantity})`, margin, yPosition);
            doc.text((item.amount * item.quantity).toFixed(2), itemWidth, yPosition);  // Format price
            yPosition += lineHeight;
            totalHeight = getContentHeight();  // Update total height
        });
    
        // Draw a horizontal line after the items
        const startX = margin;
        const startY = yPosition;
        const endX = 70;  // Width of receipt
    
        doc.setLineWidth(0.1);  // Set line width
        doc.line(startX, startY, endX, startY);  // Draw the horizontal line
    
        // Add total amount
        const totalAmount = bookings.line_items.reduce((total, current) => current.amount * current.quantity + total, 0);
    
        // Increase page height if needed for total
        if (getContentHeight() > doc.internal.pageSize.height) {
            doc.internal.pageSize.height += 15;  // Add 15mm for total and final line
        }
    
        yPosition += 5;  // Adjust Y position for total
        doc.text('Total: ', margin, yPosition);  // Format total to two decimals
        doc.text(`${totalAmount.toFixed(2)}`, 60, yPosition);
        yPosition += 10;
        doc.setFontSize(6);
        doc.text('Note:', margin, yPosition);
        yPosition += 5;
        doc.text('Flight cancellation is for Gold Tier Only',  margin, yPosition)
        yPosition += 5;
        doc.text('You can change the passenger(s) information atleast 2 hrs before departure', margin, yPosition)
        // Save the PDF
        doc.save('receipt.pdf');
    };
    

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
            departure_country: flight.departure_country,
            arrival_country: flight.arrival_country,
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

        const getMaxPassengers = async () => {
            setMaximumPassengers(GetMaxPassengers(JSON.parse(sessionStorage.getItem('flights')), decodedData.class))
        }
        getMaxPassengers();
    }, [bookings])

    const handleBooking = async () => {
        if(fareType === 'Bronze'){
            setLoading(true);
            try{
                const response = await fetch('/api/flight/book/frontdesk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bookings, email })
                })
                if(response.ok){
                    const result = await response.json();
                    generateReceipt(result.booking_ref);
                    window.open(`/tickets?data=${result._id}`, 'blank')
                    window.location.href = '/frontdesk/flights/customer'
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
            bookings.flights[currentFlightIndex].passengers[currentPassenger].seatNumber = seatNumber;
            if(bookings.flights[currentFlightIndex].passengers.length - 1 === currentPassenger){
                if(currentFlightIndex === bookings.flights.length -1){
                    setLoading(true);
                    try{
                        const response = await fetch('/api/flight/book/frontdesk', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ bookings, email })
                        })
                        if(response.ok){
                            const result = await response.json();
                            generateReceipt(result.booking_ref);
                            window.open(`/tickets?data=${result._id}`, 'blank')
                            window.location.href = '/frontdesk/flights/customer';
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

    const handlePassengers = (e) => {
        e.preventDefault();
        if(passengersType.length > maximumPassengers){
            alert(`The Maximum passengers is ${maximumPassengers}`);
        }else{
            const updatedBookings = { ...bookings };
        
        passengersType.forEach(passengerType => {
            decodedData.flights.forEach((flight, i) => {
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
                    price: price,
                    nationality: '',
                    countryOfIssue: '',
                    request: '',
                    pwd: false,
                    fareType,
                    senior_citizen: false
                }
    
                updatedBookings.flights[i].passengers.push(passenger);
            });
        });
    
        setBookings(updatedBookings);
        setShowForm(true);
        }
    };
    

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
            {loading && 
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            }
            {!fareType && <FareTypes setFareType={setFareType} frontDesk={true}/>}
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
                    <div className="input-container">
                        <div>
                        Passenger Email:
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
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

export default FrontDeskBookingPage