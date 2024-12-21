import { useEffect, useRef, useState } from 'react'
import './FlightsSearchFilter.css'

const CustomerFlightsFilter = ({setFilter, filter, filterResults}) => {
    const [showFilter, setShowFilter] = useState(false)
    const filterRef = useRef();

    const handleType = (type) => {
        setFilter({type: 'SET_TYPE', payload: type})
    }

    const handleStatus = (e) => {
        setFilter({type: 'SET_STATUS', payload: e.target.value})
    }

    const handleAirline = (e) => {
        setFilter({type: 'SET_AIRLINE', payload: e.target.value})
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target) && showFilter) {
                setShowFilter(false);
            }
        };

        // Add event listener on mount
        document.addEventListener('click', handleClickOutside);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showFilter]);

    return(
        <div className='flights-search-filter' ref={filterRef}>
            <button onClick={() => setShowFilter(prev => !prev)}>
                Filter
                <img src="/icons/filter.png" alt="" />
            </button>
            {showFilter && <div className='filter-container'>
                <div>
                    <div className='status-filter'>
                        <p>Status</p>
                        <select onChange={handleStatus} value={filter.status}>
                            <option value="All">All</option>
                            <option value="Booked">Booked</option>
                            <option value="In-Flight">In-Flight</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className='airline-filter'>
                        <p>Airline</p>
                        <select onChange={handleAirline} value={filter.airline}>
                            <option value="All">All</option>
                            <option value="PAL">PAL</option>
                            <option value="Cebu Pacific">Cebu Pacific</option>
                            <option value="Air Asia">Air Asia</option>
                            <option value="Skyject">Skyjet</option>
                        </select>
                    </div>
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
                <div className='date-parent-container'>
                    <p>Booked Date:</p>
                    <div className='date-container'>
                        From
                        <input 
                            type="date" 
                            name='type' 
                            value={filter.from}
                            onChange={(e) => setFilter({type: 'SET_FROM', payload: e.target.value})}
                        />
                    </div>
                    <div className='date-container'>
                        To
                        <input 
                            type="date" 
                            name='type' 
                            value={filter.to}
                            onChange={(e) => setFilter({type: 'SET_TO', payload: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <button onClick={filterResults}>Filter</button>
                    <button onClick={() => {
                        setFilter({type: 'RESET', callback: filterResults});
                    }}>Reset</button>
                </div>

            </div>}
        </div>
    )
}

export default CustomerFlightsFilter