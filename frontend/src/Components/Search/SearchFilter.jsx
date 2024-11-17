import { useContext } from 'react';
import './SearchFilter.css'
import { SearchContext } from '../../Context/SearchContext';
import { formatPrice } from '../../utils/formatPrice';

const SearchFilter = () => {
    const {state, dispatch} = useContext(SearchContext);

    const handlePrice = (e) => {
        const prices = [1000, 2000, 5000, 10000, 15000, 20000, 30000, 40000, 50000, 0];
        dispatch({type: 'SET_PRICE', price: prices[e.target.value - 1]})
    }

    return(
        <div className="search-filter">
            <h3>Filters</h3>
            <div>
            <h4>Price range</h4>
                <input className='slider' type="range" min='1' max='10' step='1' onChange={handlePrice}/>
                <p>{state.price != 0 ? `Below ${formatPrice(state.price)}` : 'All'}</p>
            </div>
            <div className="flightClass">
                <h4>Flight Class</h4>
                <label>
                    <input 
                        type="radio" 
                        name='class' 
                        value='Economy'
                        checked={state.flightClass === 'Economy'}
                        onChange={(e) => dispatch({type: 'SET_FLIGHT_CLASS', flightClass: e.target.value})}
                    />Economy
                    <span className='checkmark'></span>
                </label>
                <label>
                    <input 
                        type="radio" 
                        name='class' 
                        value='Business'
                        checked={state.flightClass == 'Business'}
                        onChange={(e) => dispatch({type: 'SET_FLIGHT_CLASS', flightClass: e.target.value})}
                    />Business
                    <span className='checkmark'></span>
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="class" 
                        checked={state.flightClass == 'First'}
                        value='First'
                        onChange={(e) => dispatch({type: 'SET_FLIGHT_CLASS', flightClass: e.target.value})}
                        />First
                        <span className='checkmark'></span>
                </label>
            </div>
        </div>
    )
}

export default SearchFilter