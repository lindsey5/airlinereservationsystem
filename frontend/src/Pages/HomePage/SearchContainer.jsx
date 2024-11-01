import { useContext } from "react";
import './SearchContainer.css';
import { searchFlight } from "../../Service/searchService";
import { SearchContext } from "../../Context/SearchContext";
import SearchForms from "../../Components/Search/SearchForms";

const SearchContainer = () => {
    const { state, dispatch} = useContext(SearchContext);

    const handleFlightType = (value) => {
        dispatch({type: 'SET_FLIGHT_TYPE', flightType: value})
        dispatch({type: 'SET_COUNT', count: value !== 'Multi City' ? 1 : 2})
    };

    return (
        <div className="container">
            <div className="select-container">
                <select
                    name="flightType"
                    style={{ marginRight: '20px' }}
                    onChange={(e) => handleFlightType(e.target.value)}
                >
                    <option value="One Way">One Way</option>
                    <option value="Round Trip">Round Trip</option>
                    <option value="Multi City">Multi City</option>
                </select>
                <select
                    name="flightClass"
                    onChange={(e) => dispatch({type: 'SET_FLIGHT_CLASS', flightClass: e.target.value})}
                >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                </select>
            </div>
            <SearchForms />
            <div className="buttons-container">
                {state.flightType === 'Multi City' && (
                    <button
                        className="add-flight-btn"
                        onClick={() => dispatch({ type: 'ADD_COUNT'})}
                    >
                        + Add another flight
                    </button>
                )}
                <button 
                    className='search-btn' 
                    onClick={() => searchFlight(state)}
                    disabled={state.isValid ? false : true} 
                    style={{backgroundColor: state.isValid ? 'red' : ''}}>
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchContainer;
