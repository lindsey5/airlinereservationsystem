import { useContext } from "react"
import { SearchContext } from "../../Context/SearchContext"

const SelectContainer = () => {
    const {state, dispatch} = useContext(SearchContext);

    const handleFlightType = (value) => {
        dispatch({type: 'SET_FLIGHT_TYPE', flightType: value})
        dispatch({type: 'SET_COUNT', count: value !== 'Multi City' ? 1 : 2})
    };

    return (
        <div className="select-container">
            <select
                name="flightType"
                style={{ marginRight: '20px' }}
                value={state.flightType}
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
    )
}

export default SelectContainer