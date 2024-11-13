import { useContext } from 'react'
import './ButtonsContainer.css'
import { SearchContext } from '../../Context/SearchContext'

const ButtonsContainer = ({handleSearch}) => {
    const {state, dispatch} = useContext(SearchContext)

    return (
        <div className="buttons-container">
            {state.flightType === 'Multi City' && (
                <button
                    className="add-flight-btn"
                    disabled={state.count === 5 ? true : false}
                    onClick={() => dispatch({ type: 'ADD_COUNT'})}
                >
                    + Add another flight
                </button>
            )}
            <button 
                className={`search-btn ${state.isValid ? 'isValid' : ''}`} 
                onClick={handleSearch}
                disabled={state.isValid ? false : true} 
            >
                Search
            </button>
        </div>
    )
}

export default ButtonsContainer