import { useContext, useEffect, useState } from "react"
import { SearchContext } from "../../Context/SearchContext"
import { searchFlight } from "../../Service/searchService";
import './SearchResults.css'
import { formatDate, formatToLongDate, getTime } from "../../utils/dateUtils";
import SearchForms from "../../Components/Search/SearchForms";
import ButtonsContainer from "../../Components/Search/ButtonsContainer";
import SelectContainer from "../../Components/Search/SelectContainer";
import { formatPrice } from "../../utils/formatPrice";

const SearchResults = () => {
    const {state} = useContext(SearchContext);
    const [results, setResults] = useState();
    const [showEdit, setShowEdit] = useState(false);
    const [selectedClass, setSelectedClass] = useState();
    const [loading, setLoading] = useState(true);

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
    }, []);

    return (
        <div className="search-results">
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
                {results && !loading  && results.map((flights, i) => 
                    <div key={i} className="flights-container">
                        <div>
                        {flights.map(flight => 
                            <div className='flight' key={flight._id}>
                                <img className='airline' src={`/icons/${flight.airline}.png`} alt="" />
                                <div>
                                    <p>{formatToLongDate(flight.departure.time)} - Departure</p>
                                    <h2>{getTime(flight.departure.time)}</h2>
                                    <p>{flight.departure.airport} ({flight.departure.airport_code})</p>
                                </div>
                                <div className="mid-div">
                                <hr />
                                <img className='plane-icon' src="/icons/airplane.png" alt="" />
                                <hr />
                                </div>
                                <div>
                                    <p>{formatToLongDate(flight.arrival.time)} - Arrival</p>
                                    <h2>{getTime(flight.arrival.time)}</h2>
                                    <p>{flight.arrival.airport} ({flight.arrival.airport_code})</p>
                                </div>
                                <h3 className="hours-difference">{
                                (new Date(flight.arrival.time) - new Date(flight.departure.time)) / (1000 * 60 * 60)
                                } hours
                                </h3>
                            </div>
                        )}
                        </div>
                        <div>
                        <h2>{formatPrice(flights.reduce((total, flight) => total + flight.classes.find(classObj => classObj.className === selectedClass).price, 0))}</h2>
                        <button className="select-btn">Select</button>
                        </div>
                    </div>
                )}
                {!loading && !results && 
                    <div className="no-flights">
                        <div>
                            <img src="/icons/no-travelling.png" alt="" />
                            <h1>No Flights Found</h1>
                            <p>Try another departure city, arrival city or departure date</p>
                        </div>
                    </div>
                }
                <div></div>
                </div>
            </div>

        </div>
    )


}

export default SearchResults