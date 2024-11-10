import { useContext, useEffect, useState } from "react"
import { SearchContext } from "../../Context/SearchContext"
import { searchFlight } from "../../Service/searchService";
import './SearchResults.css'
import { formatDate, formatToLongDate, getTime } from "../../utils/dateUtils";
import SearchForms from "../../Components/Search/SearchForms";
import ButtonsContainer from "../../Components/Search/ButtonsContainer";
import SelectContainer from "../../Components/Search/SelectContainer";

const SearchResults = () => {
    const {state} = useContext(SearchContext);
    const [results, setResults] = useState();
    const [showEdit, setShowEdit] = useState(false);

    const fetchResults = async () => {
        if (state) {
            setResults( await searchFlight(state));
        }
    }
    

    useEffect(() => {
        fetchResults();
    }, []);

    useEffect(() => {
        console.log(results)
    },[results])


    return (
        <div className="search-results">
            <div className="results-parent-container">
                <div className="search-form-container">
                    <div className="search-details-container">
                        <div className="search-details">
                            {state.flightType}
                            <div className="line"></div>
                            {state.flightClass}
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
                        <ButtonsContainer/>
                    </div>}
                </div>
                <div className="results-container">
                {results && results.map((flights, i) => 
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
                                <hr />
                                <img className='plane-icon' src="/icons/airplane.png" alt="" />
                                <hr />
                                <div>
                                    <p>{formatToLongDate(flight.arrival.time)} - Arrival</p>
                                    <h2>{getTime(flight.arrival.time)}</h2>
                                    <p>{flight.arrival.airport} ({flight.arrival.airport_code})</p>
                                </div>
                            </div>
                        )}
                        </div>
                        <div>
                        <button className="select-btn">Select</button>
                        </div>
                    </div>
                )}
                <div></div>
                </div>
            </div>

        </div>
    )


}

export default SearchResults