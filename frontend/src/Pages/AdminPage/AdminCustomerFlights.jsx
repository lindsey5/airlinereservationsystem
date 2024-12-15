import useAdminPaginationReducer from "../../hooks/adminPaginationReducer";
import { useState, useEffect } from "react";
import AdminPagination from "../../Components/Admin/Pagination/AdminPagination";
import '../../styles/TablePage.css';
import { formatDate } from "../../utils/dateUtils";
import { dataStatus } from "../../utils/dataStatus";

const AdminCustomerFlights = () => {
    const [flights, setFlights] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();

    useEffect(() => {
        const fetchFlights = async () => {
            dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
            dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
            try{
                const response = await fetch(`/api/flight/flights/customer?page=${state.currentPage}&&limit=50&&searchTerm=${searchTerm}`);
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

        fetchFlights();

    },[state.currentPage, searchTerm])

    useEffect(() => {
        dispatch({type:'SET_CURRENT_PAGE', payload: 1})
    }, [searchTerm])

    useEffect(() => {
        document.title = "Flights | Front Desk";
    }, []);

    return (
        <main className="table-page">
            <h1>Customer Flights</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <AdminPagination state={state} dispatch={dispatch} />
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th style={{fontSize: '15px'}}>Booking Ref</th>
                        <th style={{fontSize: '15px'}}>Flight Number</th>
                        <th style={{fontSize: '15px'}}>Airline</th>
                        <th style={{fontSize: '15px'}}>Gate No</th>
                        <th style={{fontSize: '15px'}}>Departure</th>
                        <th style={{fontSize: '15px'}}>Departure Time</th>
                        <th style={{fontSize: '15px'}}>Arrival</th>
                        <th style={{fontSize: '15px'}}>Arrival Time</th>
                        <th style={{fontSize: '15px'}}>Status</th>
                        <th style={{fontSize: '15px'}}>Fare Type</th>
                        <th style={{fontSize: '15px'}}>Passengers</th>
                        <th style={{fontSize: '15px'}}>Payment Method</th>
                    </tr>
                </thead>
                <tbody>
                    {flights && flights.map((flight, i) => {
                        const departureTime = formatDate(flight.flight.departure.time);
                        const arrivalTime = formatDate(flight.flight.arrival.time);

                        return (
                            <tr key={i}>
                                <td>{flight.bookingRef}</td>
                                <td>{flight.flight.flightNumber}</td>
                                <td>{flight.flight.airline}</td>
                                <td>{flight.flight.gate_number}</td>
                                <td>{flight.flight.departure.airport} ({flight.flight.departure.airport_code})</td>
                                <td>{departureTime}</td>
                                <td>{flight.flight.arrival.airport} ({flight.flight.arrival.airport_code})</td>
                                <td>{arrivalTime}</td>
                                {dataStatus(flight.flight.status)}
                                <td>{flight.fareType}</td>
                                <td>{flight.flight.passengers.length}</td>
                                <td>{flight.payment_method}</td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </table>
            </div>
        </main>
    )
}

export default AdminCustomerFlights