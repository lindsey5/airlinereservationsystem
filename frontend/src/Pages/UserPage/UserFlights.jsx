import { useState } from "react"
import useFetch from "../../hooks/useFetch"
import './UserFlights.css'
import { formatDate } from "../../utils/dateUtils"
import FlightModal from "../../Components/User/Modals/FlightModal"
import { useEffect } from "react"
import ErrorCancelModal from "../../Components/Modals/ErrorCancelModal"
import RefundSummary from "../../Components/Booking/RefundSummary"
import { useNavigate } from "react-router-dom"

const UserFlights = () => {
    const [flights, setFlights] = useState([]);
    const [showFlight, setShowFlight] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState();
    const [title, setTitle] = useState('Upcoming');
    const [showCancelError, setShowCancelError] = useState(false);
    const [limit, setLimit] = useState(5);
    const {data, loading} = useFetch(`/api/booking/bookings?filter=${title}`);
    const [showRefund, setShowRefund] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showSeeMore, setShowSeeMore] = useState(true);

    useEffect(() => {
        if(data){
            const flightsArr = [];
            data.forEach((item) => {
                item.flights.forEach(flight => {
                    flightsArr.push({...flight, 
                        fareType: item.fareType, 
                        bookingRef: item._id,
                        class: item.class, 
                        booked_on: item.createdAt
                    })
                })
            })
            setFlights(flightsArr.slice(0, limit));
        }
    },[data, limit])

    useEffect(() => {
        if(flights.length > 0){
            const flightsArr = [];
            data.forEach((item) => {
                item.flights.forEach(flight => {
                    flightsArr.push({...flight, 
                        fareType: item.fareType, 
                        bookingRef: item._id,
                        class: item.class, 
                        booked_on: item.createdAt
                    })
                })
            })
            if(flights.length === flightsArr.length) setShowSeeMore(false)
        }
    }, [flights])

    useEffect(() => {
        setLimit(5)
    }, [title])

    const handleFlight = (flight) => {
        setShowFlight(true);
        setSelectedFlight(flight)
    }

    const handleFilter = (e) => {
        setTitle(e.target.value)
    }

    const utf8ToBase64 = (str) => {
        // Create a UTF-8 encoded byte array from the string
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(str);
    
        // Convert the byte array to a Base64 encoded string
        let binary = '';
        uint8Array.forEach(byte => binary += String.fromCharCode(byte));
        return btoa(binary);
    }

    const editPassengers = (flight) => {
        const params = flight;
        const encoded = encodeURIComponent(utf8ToBase64(JSON.stringify(params)));
        navigate(`/user/passengers/edit?data=${encoded}`);
    }

    return(
        <div className="user-bookings">
            {showRefund && <RefundSummary flight={selectedFlight} close={() => setShowRefund(false)} showError={() => setShowCancelError(true)} setError={setError}/>}
            {showCancelError && <ErrorCancelModal close={() => setShowCancelError(false)} error={error}/>}
            {showFlight && <FlightModal flight={selectedFlight} close={() => setShowFlight(false)}/>}
            <div className="container">
            <div>
                <h1>{title} Flights</h1>
                <select onChange={handleFilter}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="In-Flight">In-Flight</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                    <option value="All">All</option>
                </select>
            </div>
            {flights.length > 0 && flights.map(flight => {
                let date1 = new Date(); 
                let date2 = new Date(flight.departure.time);
                let diffMillis = date2 - date1;
                let diffHours = diffMillis / (1000 * 60 * 60)
                return <div className="flight" key={flight._id}>
                    <img src={`/icons/${flight.airline}.png`} alt="" />
                        <div className="destination">
                            <div>
                                <p>{flight.departure.country}</p>
                                <p>{flight.departure.airport} ({flight.departure.airport_code})</p>
                                <h4>{formatDate(flight.departure.time)}</h4>
                            </div>
                            <div className="mid-div">
                            <hr />
                            <div className="plane-icon">
                                <img src="/icons/airplane.png" alt="" />
                                <h4 className="hours-difference">{
                                    (parseFloat(new Date(flight.arrival.time) - new Date(flight.departure.time)) / (1000 * 60 * 60)).toLocaleString('en-US', {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1
                                    })
                                    } hours
                                </h4>
                                <p className={flight.status}>{flight.status}</p>
                            </div>
                            <hr />
                            </div>
                            <div>
                                <p>{flight.arrival.country}</p>
                                <p>{flight.arrival.airport} ({flight.arrival.airport_code})</p>
                                <h4>{formatDate(flight.arrival.time)}</h4>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => handleFlight(flight)}>
                                <img src="/icons/eye (1).png" alt="" />
                            </button>
                            
                            {!(flight.departure.time <= new Date()) && flight.status === 'Booked' &&  
                                <button onClick={() => {
                                        setShowRefund(true);
                                        setSelectedFlight({...flight, fareType: flight.fareType, bookingRef: flight.bookingRef })
                                    }}>
                                <img src="/icons/cancel.png" alt="cancel" />
                            </button>}
                            {diffHours > 2 && flight.status === 'Booked' && 
                            <button onClick={() => editPassengers(flight)}>
                                <img src="/icons/editing.png" alt="" />
                            </button>}
                        </div>
                        <p className="book-date">Book Date: {formatDate(flight.booked_on)}</p>
                </div>}
            )}
            {flights.length > 0 && showSeeMore && <button className='see-more' onClick={() => setLimit(prev => prev += 5)} >See more</button>}
            {flights.length < 1 && !loading && <div className="no-flights">
                        <div>
                            <img src="/icons/no-travelling.png" alt="" />
                            <h2>You don't have {title !== 'All' && title + ' '}Flights</h2>
                        </div>
                    </div>}
            </div>


        </div>
    )
}

export default UserFlights