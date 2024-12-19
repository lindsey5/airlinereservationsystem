import { useEffect, useRef, useState } from "react"
import useFetch from "../../hooks/useFetch";
import { formatDate, formatDateOnly, getTime } from "../../utils/dateUtils";
import { formatPrice } from "../../utils/formatPrice";
import '../../styles/AvailableFlights.css';
import '../../styles/Flights.css';
import { useNavigate } from "react-router-dom";
import GetMaxPassengers from "../../utils/GetMaxPassengers";

const AvailableFlights = () => {
    const [limit, setLimit] = useState(5);
    const [flights, setFlights] = useState([]);
    const [selectedClass, setSelectedClass] = useState('Economy');
    const [searchTerm, setSearchTerm] = useState('');
    const searchRef = useRef();
    const [type, setType] = useState();
    const {data, loading} = useFetch(`/api/flight/flights/available?limit=${limit}&&selectedClass=${selectedClass}&&searchTerm=${searchTerm}&&type=${type}`)
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Available Flights";
    },[])

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
        // Initialize an object to store selected flight details and price
        const params = { flights: [], price: 0, class: selectedClass };
    
        // Find the price for the selected class in the flight's classes and update params.price
        params.price = flight.classes.find(classObj => classObj.className === selectedClass).price;
    
        // Add the selected flight's details to the flights array in the params object
        params.flights.push({ 
            id: flight._id, // Store the flight's unique ID
            departure: flight.departure.airport, // Departure airport name
            departure_country: flight.departure.country, // Departure country
            departure_code: flight.departure.airport_code, // IATA code for the departure airport
            departure_time: formatDate(flight.departure.time), // Formatted departure time
            arrival: flight.arrival.airport, // Arrival airport name
            arrival_country: flight.arrival.country, // Arrival country
            arrival_code: flight.arrival.airport_code, // IATA code for the arrival airport
            arrival_time: formatDate(flight.arrival.time), // Formatted arrival time
            price: flight.classes.find(classObj => classObj.className === selectedClass).price, // Price for the selected class
        });
    
        // Encode the params object (flight details and price) into a URL-friendly string
        const encoded = encodeURIComponent(utf8ToBase64(JSON.stringify(params)));
        sessionStorage.setItem('flights', JSON.stringify([flight]));
        // Navigate to the booking page with the encoded flight data as a URL parameter
        navigate(`/user/booking?data=${encoded}`);
    };
    
    return (
        <div className="available-flights">
            <div>
            {loading && <div className="loader-container">
                <div className="loader"></div>
            </div>}
            <div>
                <h1>Available Flights</h1>
                <select onChange={(e) => setType(e.target.value)} style={{marginRight: '30px'}}>
                    <option value="">All</option>
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                </select>
                <input type="search" className="search-bar" placeholder="Search City" ref={searchRef}/>
                <button onClick={() => setSearchTerm(searchRef.current.value)}>Search</button>
            </div>

            <select onChange={(e) => setSelectedClass(e.target.value)}>
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
            </select>
            </div>
            <div className="container">
                {flights.length > 0 && !loading && flights.map((flight, i) => 
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
                        <h4>Availble Seats: {flight.classes.find(classObj => classObj.className === selectedClass) && GetMaxPassengers([flight], selectedClass)}</h4>
                        <h4 style={{marginBottom: '5px'}}>{selectedClass}</h4>
                        <h2>{formatPrice(flight.classes.find(classObj => classObj.className === selectedClass)?.price)}</h2>
                        <button className="select-btn" onClick={() => handleSelect(flight)}>Select</button>
                    </div>
                </div>
                )
                }
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
            {flights.length > 0 && data?.totalFlights !== flights.length && <button className='see-more' onClick={() => setLimit(prev => prev += 5)} >See more</button>}
        </div>
    )
}

export default AvailableFlights