import { useState } from "react"
import useFetch from "../../hooks/useFetch"
import './UserFlights.css'
import { formatDate } from "../../utils/dateUtils"
import PassengersModal from "../../Components/User/Modals/PassengersModal"
import { useEffect } from "react"

const UserFlights = () => {
    const {data} = useFetch('/api/booking/bookings');
    const [flights, setFlights] = useState();
    const [showPassengers, setShowPassengers] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState();

    useEffect(() => {
        if(data){
            console.log(data)
            const flightsArr = [];
            data.forEach(item => {
                item.flights.forEach(flight => {
                    const isExist = flightsArr.find(flightObj => flightObj.id === flight.id);
                    const isUpcoming = new Date(isExist?.departure.time) > new Date();
                    if(isExist && isUpcoming){
                        const passengers = isExist.passengers.map(passenger => {
                            passenger.fareType = item.fareType;
                            passenger.class = item.class
                            return passenger
                        });
                        isExist.passengers = [...passengers, ...item.passengers]
                    }else{
                        const passengers = item.passengers.map(passenger => {
                            passenger.fareType = item.fareType;
                            passenger.class = item.class
                            return passenger
                        })
                        flightsArr.push({...flight, passengers})
                    }
                })
            })
            const sortedFlights = flightsArr.sort((current, next) => new Date(current.departure.time) - new Date(next.departure.time))
            setFlights(sortedFlights)
        }
    },[data])

    const handlePassengers = (flight) => {
        setShowPassengers(true);
        setSelectedFlight(flight)
    }

    return(
        <div className="user-bookings">
            {showPassengers && <PassengersModal flight={selectedFlight} close={() => setShowPassengers(false)}/>}
            <div className="container">
            <h2>Upcoming Flights</h2>
            {flights && flights.map(flight => 
                <div className="flight" key={flight.id}>
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
                            <p>Flight No: {flight.flightNumber}</p>
                            <p>Gate No: {flight.gate_number}</p>
                        </div>
                        <button onClick={() => handlePassengers(flight)}>
                            <img src="/icons/eye (1).png" alt="" />
                        </button>
                </div>
            )}
            </div>


        </div>
    )
}

export default UserFlights