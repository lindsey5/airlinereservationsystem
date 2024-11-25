import useAdminPaginationReducer from "../../hooks/adminPaginationReducer";
import { useState, useEffect, useReducer } from "react";
import AdminPagination from "../../Components/Admin/Pagination/AdminPagination";
import '../../styles/TablePage.css';
import { formatDate } from "../../utils/dateUtils";
import { dataStatus } from "../../utils/dataStatus";
import FlightForm from "../../Components/Admin/Flights/FlightForm";
import FlightDetailsModal from "../../Components/Modals/FlightDetailsModal";
import FlightsSearchFilter from "../../Components/Flights/FlightsSearchFilter";

const filterState = {
    status: 'Scheduled',
    type: 'All',
    departureTime: '',
    arrivalTime: '',
}

const filterReducer = (state, action) => {
    switch(action.type){
        case 'SET_STATUS':
            return {...state, status: action.payload}
        case 'SET_TYPE':
            return {...state, type: action.payload}        
        case 'SET_DEPARTURE_TIME':
            return {...state, departureTime: action.payload}
        case 'SET_ARRIVAL_TIME':
            return {...state, arrivalTime: action.payload}
        case 'RESET':
            return filterState
        default: 
            return state
    }
}

const AdminFlights = () => {
    const [flights, setFlights] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();
    const [showMakeFlight, setShowMakeFlight] = useState(false);
    const [flightData, setFlightData] = useState();
    const [showFlightDetails, setShowFlightDetails] = useState(false);
    const [filter, setFilter] = useReducer(filterReducer, filterState);

    const fetchFlights = async () => {
        dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
        dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
        try{
            const response = await fetch(`/api/flight/flights?page=${state.currentPage}&&limit=50&&searchTerm=${searchTerm}&&status=${filter.status}&&type=${filter.type}&&departureTime=${filter.departureTime}&&arrivalTime=${filter.arrivalTime}`);
            if(response.ok){
                const result = await response.json();
                result.currentPage === result.totalPages || result.totalPages === 0 ? dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true}) :  dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: false});
                result.currentPage === 1 ? dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true}) : dispatch({type: 'SET_DISABLED_PREV_BTN', payload: false});
                dispatch({type: 'SET_TOTAL_PAGES', payload: result.totalPages});
                setFlights(result.flights);
            }
        }catch(err){

        }
    }

    useEffect(() => {
        console.log(filter)
    }, [filter])

    useEffect(() => {
        fetchFlights()
    },[state.currentPage, searchTerm])

    useEffect(() => {
        dispatch({type:'SET_CURRENT_PAGE', payload: 1})
    }, [searchTerm])

    useEffect(() => {
        document.title = "Flights | Admin";
    }, []);

    const completeFlight = async (flightId) => {
        try{
            if(confirm('Flight completed?')){
                 const response = await fetch(`/api/flight/${flightId}/complete`,{
                 method: 'PUT',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 })
                 if(response.ok){
                     window.location.reload();
                 }
            }
         }catch(err){
             console.error(err)
         }
    }

    const updateFlight = async (flightId) => {
        try{
            if(confirm('Set flight status to in-flight?')){
                 const response = await fetch(`/api/flight/${flightId}`,{
                 method: 'PUT',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 })
                 if(response.ok){
                     window.location.reload();
                 }
            }
         }catch(err){
             console.error(err)
         }
    }

    return (
        <main className="table-page">
            {showMakeFlight && <FlightForm close={() => setShowMakeFlight(false)}/>}
            {showFlightDetails && <FlightDetailsModal flightData={flightData} close={() => setShowFlightDetails(false)}/>}
            <h1>Flights</h1>
            <AdminPagination state={state} dispatch={dispatch} />
            <div style={{display: 'flex'}}>
                <input type="search" placeholder='Search' style={{marginRight: '30px'}} onChange={(e) => setSearchTerm(e.target.value)}/>
                <FlightsSearchFilter setFilter={setFilter} filter={filter} filterResults={fetchFlights}/>
            </div>
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Flight Number</th>
                        <th>Airline</th>
                        <th>Gate No</th>
                        <th>Departure</th>
                        <th>Departure Time</th>
                        <th>Arrival</th>
                        <th>Arrival Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {flights && flights.map(flight => {
                        const departureTime = formatDate(flight.departure.time);
                        const arrivalTime = formatDate(flight.arrival.time);

                        return (
                            <tr key={flight._id}>
                                <td>{flight.flightNumber}</td>
                                <td>{flight.airline}</td>
                                <td>{flight.gate_number}</td>
                                <td>{flight.departure.airport} ({flight.departure.airport_code})</td>
                                <td>{departureTime}</td>
                                <td>{flight.arrival.airport} ({flight.arrival.airport_code})</td>
                                <td>{arrivalTime}</td>
                                {dataStatus(flight.status)}
                                <td>
                                    {flight.status !== 'Completed' && flight.status !== 'Cancelled' &&
                                    <button onClick={() => flight.status === 'Scheduled' ? updateFlight(flight._id) : completeFlight(flight._id)}>
                                        <img src="/icons/check.png" alt="" />
                                    </button>
                                    }
                                    <button onClick={() => {
                                        setFlightData(flight)
                                        setShowFlightDetails(true)
                                    }}>
                                    <img src="/icons/eye (1).png"/>
                                    </button>
                                </td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </table>
            </div>
            <button className='add-btn' onClick={() => setShowMakeFlight(true)}>Make Flight</button>
        </main>
    )
}

export default AdminFlights