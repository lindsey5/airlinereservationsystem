import { useEffect, useState, useRef } from "react"
import useFetch from "../../hooks/useFetch";
import { formatDate, formatDateOnly, getTime } from "../../utils/dateUtils";
import { formatPrice } from "../../utils/formatPrice";
import '../../styles/AvailableFlights.css';
import '../../styles/Flights.css';
import { useNavigate } from "react-router-dom";
import GetMaxPassengers from "../../utils/GetMaxPassengers";

const FrontDeskAvailableFlights = () => {
    const [limit, setLimit] = useState(5);
    const [flights, setFlights] = useState([]);
    const [selectedClass, setSelectedClass] = useState('Economy');
    const [searchTerm, setSearchTerm] = useState('');
    const searchRef = useRef();
    const {data, loading} = useFetch(`/api/flight/flights/available?limit=${limit}&&selectedClass=${selectedClass}&&searchTerm=${searchTerm}`)
    const navigate = useNavigate();
    const [maximumPassengers, setMaximumPassengers] = useState([]);

    useEffect(() => {
        document.title = "Available Flights";
    },[])

    useEffect(() => {
        if(flights.length > 0){
            const getMaxPassengers = async () => {
                const maxPassengers = []
                for(const flight of flights){
                    maxPassengers.push(await GetMaxPassengers([flight], selectedClass))
                }
                setMaximumPassengers(maxPassengers);
            }

            getMaxPassengers();
        }
    }, [flights]) 

    useEffect(() =>{
        if(data?.flights){
            setFlights(data.flights);
        }
    },[data, limit, selectedClass])

    const utf8ToBase64 = (str) => {
        // Create a UTF-8 encoded byte array from the string
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(str);
    
        // Convert the byte array to a Base64 encoded string
        let binary = '';
        uint8Array.forEach(byte => binary += String.fromCharCode(byte));
        return btoa(binary);
    }

    const handleSelect = (flight) => {
        const params = {flights: [], price: 0, class: selectedClass}
        params.price = flight.classes.find(classObj => classObj.className === selectedClass).price
        params.flights.push({ 
            id: flight._id,
            departure: flight.departure.airport,
            departure_country: flight.departure.country,
            departure_code: flight.departure.airport_code,
            departure_time: formatDate(flight.departure.time),
            arrival: flight.arrival.airport,
            arrival_country: flight.arrival.country,
            arrival_code: flight.arrival.airport_code,
            arrival_time: formatDate(flight.arrival.time),
            price: flight.classes.find(classObj => classObj.className === selectedClass).price,
        })
        const encoded = encodeURIComponent(utf8ToBase64(JSON.stringify(params)));
        navigate(`/frontdesk/booking?data=${encoded}`);
    }

    return (
        <div className="available-flights frontdesk">
            <div>
            {loading && <div className="loader-container">
                    <div className="loader">

                    </div>
                </div>}
            <div>
                <h1>Available Flights</h1>
                <input type="search" className="search-bar" placeholder="Search city" ref={searchRef}/>
                <button onClick={() => setSearchTerm(searchRef.current.value)}>Search</button>
            </div>
            <select onChange={(e) => setSelectedClass(e.target.value)}>
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
            </select>
            </div>
            <div className="container">
                {flights.length > 0 && flights.map((flight, i) => 
                <div key={flight._id} className="flights-container">
                    <div>
                        <div className='flight'>
                            <img className='airline' src={`/icons/${flight.airline}.png`} alt="" />
                            <div>
                                <div>
                                    <p>{formatDateOnly(flight.departure.time)} - Departure</p>
                                    <h2>{getTime(flight.departure.time)}</h2>
                                    <p>{flight.departure.airport} ({flight.departure.airport_code})</p>
                                    <p>{flight.departure.city}, {flight.departure.country}</p>
                                </div>
                                <div className="mid-div">
                                <hr />
                                <div>
                                    <img className='plane-icon' src="/icons/airplane.png" alt="" />
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
                                    <p>{formatDateOnly(flight.arrival.time)} - Arrival</p>
                                    <h2>{getTime(flight.arrival.time)}</h2>
                                    <p>{flight.arrival.airport} ({flight.arrival.airport_code})</p>
                                    <p>{flight.arrival.city}, {flight.arrival.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4>Availble Seats: {maximumPassengers[i]}</h4>
                        <h4 style={{marginBottom: '5px'}}>{selectedClass}</h4>
                        <h2>{formatPrice(flight.classes.find(classObj => classObj.className === selectedClass).price)}</h2>
                        <button className="select-btn" onClick={() => handleSelect(flight)}>Select</button>
                    </div>
                </div>
                )}
                {
                !loading && flights.length < 1 &&
                <div className="no-flights">
                    <div>
                        <img src="/icons/no-travelling.png" alt="" />
                        <h1>No Available Flights</h1>
                    </div>
                </div>
                }
            </div>
            {flights.length > 0 && flights.length !== data.totalFlights &&  <button className='see-more' onClick={() => setLimit(prev => prev += 5)} >See more</button>}
        </div>
    )
}

export default FrontDeskAvailableFlights