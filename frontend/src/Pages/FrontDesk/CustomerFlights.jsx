import useAdminPaginationReducer from "../../hooks/adminPaginationReducer";
import { useState, useEffect } from "react";
import AdminPagination from "../../Components/Admin/Pagination/AdminPagination";
import '../../styles/TablePage.css';
import { formatDate } from "../../utils/dateUtils";
import { dataStatus } from "../../utils/dataStatus";
import { cancelFlight } from "../../Service/flightService";
import ErrorCancelModal from "../../Components/Modals/ErrorCancelModal";
import RefundSummary from "../../Components/Booking/RefundSummary";

const CustomerFlights = () => {
    const [flights, setFlights] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();
    const [showCancelError, setShowCancelError] = useState(false);
    const [showRefund, setShowRefund] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState();

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
            {showRefund && <RefundSummary flight={selectedFlight} close={() => setShowRefund(false)} showError={() => setShowCancelError(true)}/>}
            {showCancelError && <ErrorCancelModal close={() => setShowCancelError(false)}/>}
            <h1>Customer Flights</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <AdminPagination state={state} dispatch={dispatch} />
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Booking Ref</th>
                        <th>Flight Number</th>
                        <th>Airline</th>
                        <th>Gate No</th>
                        <th>Departure</th>
                        <th>Departure Time</th>
                        <th>Arrival</th>
                        <th>Arrival Time</th>
                        <th>Status</th>
                        <th>Passengers</th>
                        <th>Action</th>
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
                                <td>{flight.flight.passengers.length}</td>
                                <td>
                                {flight.flight.status === 'Booked' && 
                                    <button onClick={() => {
                                        setShowRefund(true);
                                        setSelectedFlight({...flight.flight, fareType: flight.fareType, bookingRef: flight.bookingRef })
                                    }}>
                                    <img src="/icons/cancel.png"/>
                                    </button>
                                }
                                </td>
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

export default CustomerFlights