import useAdminPaginationReducer from "../../hooks/adminPaginationReducer";
import { useState, useEffect } from "react";
import AdminPagination from "../../Components/Admin/Pagination/AdminPagination";
import '../../styles/TablePage.css';
import { formatDate } from "../../utils/dateUtils";
import { dataStatus } from "../../utils/dataStatus";
import ErrorCancelModal from "../../Components/Modals/ErrorCancelModal";
import RefundSummary from "../../Components/Booking/RefundSummary";

const CustomerFlights = () => {
    const [flights, setFlights] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();
    const [showCancelError, setShowCancelError] = useState(false);
    const [showRefund, setShowRefund] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState();
    const [error, setError] = useState('');

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
            {showRefund && <RefundSummary flight={selectedFlight} close={() => setShowRefund(false)} showError={() => setShowCancelError(true)} setError={setError}/>}
            {showCancelError && <ErrorCancelModal close={() => setShowCancelError(false)} error={error}/>}
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
                        <th style={{fontSize: '15px'}}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {flights && flights.map((flight, i) => {
                        const departureTime = formatDate(flight.flight.departure.time);
                        const arrivalTime = formatDate(flight.flight.arrival.time);

                        let date1 = new Date(); 
                        let date2 = new Date(flight.flight.departure.time);
                        let diffMillis = date2 - date1;
                        let diffHours = diffMillis / (1000 * 60 * 60)

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
                                <td>
                                {!(diffHours <= 2) && !(new Date() >= new Date(flight.flight.departure.time)) && flight.flight.status === 'Booked' && 
                                    <>
                                        {flight.fareType === 'Gold' && 
                                            <button onClick={() => {
                                                setShowRefund(true);
                                                setSelectedFlight({...flight.flight, fareType: flight.fareType, bookingRef: flight.bookingRef })
                                            }}>
                                                <img src="/icons/cancel.png"/>
                                            </button>}
                                        <button>
                                            <img src="/icons/editing.png"/>
                                        </button>
                                    </>
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