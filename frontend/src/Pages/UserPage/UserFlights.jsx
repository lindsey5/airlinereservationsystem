import { useState } from "react"
import useFetch from "../../hooks/useFetch"
import './UserFlights.css'
import { formatDate } from "../../utils/dateUtils"
import PassengersModal from "../../Components/User/Modals/PassengersModal"
import { useEffect } from "react"
import ErrorCancelModal from "../../Components/User/Modals/ErrorCancelModal"

const UserFlights = () => {
    const [flights, setFlights] = useState([]);
    const [showPassengers, setShowPassengers] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState();
    const [title, setTitle] = useState('All');
    const [showCancelError, setShowCancelError] = useState(false);
    const [limit, setLimit] = useState(5);
    const {data} = useFetch(`/api/booking/bookings?filter=${title}`);

    useEffect(() => {
        if(data){
            const flightsArr = [];
            let total = 0;

            for(const item of data){
                for(const flight of item.flights){
                    const passengers = flight.passengers.map(passenger => {
                        passenger.fareType = item.fareType;
                        return passenger
                    })
                    if(total !== limit){
                        flightsArr.push({...flight, 
                            passengers, 
                            bookingRef: item._id,
                            class: item.class, 
                            bookId: item._id,
                            booked_on: item.createdAt
                        })
                        total ++;
                    }else{
                        break;
                    }
                }
            }
            setFlights(flightsArr)
        }
    },[data, limit])

    useEffect(() => {
        setLimit(5)
    }, [title])

    const handlePassengers = (flight) => {
        setShowPassengers(true);
        setSelectedFlight(flight)
    }

    const cancelFlight = async ({bookId, flightId}) => {
        try{
           if(confirm('Are you sure do you wan\'t to cancel this flight?')){
                const response = await fetch(`/api/flight/cancel`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({bookId, flightId}),
                })
                if(response.ok){
                    window.location.reload();
                }
                if(!response.ok){
                    setShowCancelError(true)
                }
           }
        }catch(err){
            console.error(err)
        }
    }

    const handleFilter = (e) => {
        const flightsArr = [];
            data.forEach(item => {
                item.flights.forEach(flight => {
                        const passengers = flight.passengers.map(passenger => {
                            passenger.fareType = item.fareType;
                            return passenger
                        })
                        flightsArr.push({
                            ...flight, 
                            passengers, 
                            class: item.class, 
                            bookId: item._id,
                            booked_on: item.createdAt
                        })
                    })
            })
            setTitle(e.target.value)
    }

    return(
        <div className="user-bookings">
            {showCancelError && <ErrorCancelModal close={() => setShowCancelError(false)}/>}
            {showPassengers && <PassengersModal flight={selectedFlight} close={() => setShowPassengers(false)}/>}
            <div className="container">
            <div>
                <h2>{title} Flights</h2>
                <select onChange={handleFilter}>
                    <option value="All">All</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            {flights.length > 0 && flights.map(flight => 
                <div className="flight" key={flight._id}>
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
                            <button onClick={() => handlePassengers(flight)}>
                                <img src="/icons/eye (1).png" alt="" />
                            </button>
                            {flight.status === 'Booked' && flight.passengers[0].fareType === 'Gold' && 
                            <button onClick={() => cancelFlight({bookId: flight.bookId, flightId: flight.id})}>
                                <img src="/icons/cancel.png" alt="cancel" />
                            </button>}
                        </div>
                        <p className="book-date">Book Date: {formatDate(flight.booked_on)}</p>
                </div>
            )}
            {flights.length > 0 &&  <button className='see-more' onClick={() => setLimit(prev => prev += 5)} >See more</button>}
            {flights.length < 1 && <div className="no-flights">
                        <div>
                            <img src="/icons/no-travelling.png" alt="" />
                            <h2>You don't have {title !== 'All' && title + ' '}Flights yet</h2>
                        </div>
                    </div>}
            </div>


        </div>
    )
}

export default UserFlights