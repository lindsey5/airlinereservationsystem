import { useContext, useEffect, useRef, useState } from "react"
import { SearchContext } from "../../Context/SearchContext"
import { searchFlight } from "../../Service/searchService";
import '../../styles/Flights.css';
import '../../styles/SearchResults.css';
import { formatDate, formatDateOnly, getTime } from "../../utils/dateUtils";
import SearchForms from "../../Components/Search/SearchForms";
import ButtonsContainer from "../../Components/Search/ButtonsContainer";
import SelectContainer from "../../Components/Search/SelectContainer";
import { formatPrice } from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../../Components/Search/SearchFilter";

const FrontDeskSearchResults = () => {
    const {state} = useContext(SearchContext);
    const [results, setResults] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedClass, setSelectedClass] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchResults = async () => {
        if (state) {
            setLoading(true)
            setSelectedClass(state.flightClass)
            setResults(await searchFlight(state));
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchResults();
        document.title = "Search Results";
    }, []);

    useEffect(() => {
        fetchResults()
    }, [state.price, state.flightClass])

    const utf8ToBase64 = (str) => {
        // Create a UTF-8 encoded byte array from the string
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(str);
    
        // Convert the byte array to a Base64 encoded string
        let binary = '';
        uint8Array.forEach(byte => binary += String.fromCharCode(byte));
        return btoa(binary);
    }

    const handleSelect = (flights) => {
        const params = {flights: [], price: 0, class: selectedClass};
        flights.forEach(flight => {
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
        })

        params.price = flights.reduce((total, flight) => total + flight.classes.find(classObj => classObj.className === selectedClass).price, 0)
       
        const encoded = encodeURIComponent(utf8ToBase64(JSON.stringify(params)));
        navigate(`/frontdesk/booking?data=${encoded}`);
    }

    return (
        <div className="search-results frontdesk">
            {loading && <div className="loader-container">
                <div className="loader"></div>
            </div>}
            <div className="results-parent-container">
                    <div className="search-details-container">
                        <div className="search-details">
                            {state.flightType}
                            <div className="line"></div>
                            {selectedClass}
                            <div className="line"></div>
                            <h3>{state.flights[0].FromCity && state.flights[0].FromCity}</h3>
                            <img src="/icons/airplane.png" alt="" />
                            <h3>{state.flights[0].ToCity && state.flights[0].ToCity}</h3>
                            <div className="line"></div>
                            {formatDate(state.flights[0].DepartureTime)}
                        </div>
                        <button onClick={() => setShowEdit(!showEdit)}>{showEdit ? 'Hide Search' : 'Edit Search'}</button>
                    </div>
                    {showEdit &&
                    <div className="forms-container">
                        <SelectContainer />
                        <SearchForms />
                        <ButtonsContainer handleSearch={fetchResults}/>
                    </div>}
                <div className="results-container">   
                <SearchFilter />
                <div>
                {results && !loading  && results.map((flights, i) => 
                    <div key={i} className="flights-container">
                        <div>
                        {flights.map(flight => 
                        <div className='flight'>
                            <img className='airline' src={`/icons/${flight.airline}.png`} alt="" />
                            <div className="flight-container">
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
                        )}
                        </div>
                        <div>
                        <h4 style={{marginBottom: '5px'}}>{selectedClass}</h4>
                        <h2>{formatPrice(flights.reduce((total, flight) => total + flight.classes.find(classObj => classObj.className === selectedClass).price, 0))}</h2>
                        <button className="select-btn" onClick={() => handleSelect(flights)}>Select</button>
                        </div>
                    </div>
                )}
                {!loading && results?.length < 1&& 
                    <div className="no-flights">
                        <div>
                            <img src="/icons/no-travelling.png" alt="" />
                            <h1>No Flights Found</h1>
                        </div>
                    </div>
                }
                </div>
                </div>
            </div>

        </div>
    )


}

export default FrontDeskSearchResults