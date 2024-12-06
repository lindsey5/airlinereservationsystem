import { useEffect, useState } from 'react'
import './FlightsSearchFilter.css'

const FlightsSearchFilter = ({setFilter, filter, filterResults}) => {
    const [showFilter, setShowFilter] = useState(false)

    const handleType = (type) => {
        setFilter({type: 'SET_TYPE', payload: type})
    }

    const handleStatus = (e) => {
        setFilter({type: 'SET_STATUS', payload: e.target.value})
    }

    useEffect(() => {

    }, [filter])

    return(
        <div className='flights-search-filter'>
            <button onClick={() => setShowFilter(prev => !prev)}>
                Filter
                <img src="/icons/filter.png" alt="" />
            </button>
            {showFilter && <div className='filter-container'>
                <div>
                    <select onChange={handleStatus} value={filter.status}>
                        <option value="All">All</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="In-Flight">In-Flight</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div>
                    <div className='radio-container'>
                        <input type="radio" 
                            name='type' 
                            checked={filter.type === 'All'} 
                            onChange={() => handleType('All')}
                        />All
                    </div>
                    <div className='radio-container'>
                        <input type="radio" 
                            name='type' 
                            checked={filter.type === 'Domestic'} 
                            onChange={() => handleType('Domestic')}
                        />Domestic
                    </div>
                    <div className='radio-container'>
                        <input type="radio" 
                            name='type' 
                            checked={filter.type === 'International'} 
                            onChange={() => handleType('International')}
                        />International
                    </div>
                </div>
                <div>
                    <div className='date-container'>
                        Departure Date
                        <input 
                            type="date" 
                            name='type' 
                            value={filter.departureTime}
                            onChange={(e) => setFilter({type: 'SET_DEPARTURE_TIME', payload: e.target.value})}
                        />
                    </div>
                    <div className='date-container'>
                        Arrival Date
                        <input 
                            type="date" 
                            name='type' 
                            value={filter.arrivalTime}
                            onChange={(e) => setFilter({type: 'SET_ARRIVAL_TIME', payload: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <button onClick={filterResults}>Filter</button>
                    <button onClick={() => {
                        setFilter({type: 'RESET'});
                    }}>Reset</button>
                </div>

            </div>}
        </div>
    )
}

export default FlightsSearchFilter