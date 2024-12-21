import useAdminPaginationReducer from "../../hooks/adminPaginationReducer";
import { useState, useEffect, useReducer } from "react";
import AdminPagination from "../../Components/Admin/Pagination/AdminPagination";
import '../../styles/TablePage.css';
import { formatDate } from "../../utils/dateUtils";
import { dataStatus } from "../../utils/dataStatus";
import CustomerFlightsFilter from "../../Components/Flights/CustomerFlightsFilter";

const filterState = {
    status: 'All',
    type: 'All',
    airline: 'All',
    from: '',
    to: '',
}

const filterReducer = (state, action) => {
    switch(action.type){
        case 'SET_STATUS':
            return {...state, status: action.payload}
        case 'SET_TYPE':
            return {...state, type: action.payload}        
        case 'SET_AIRLINE' : 
            return {...state, airline: action.payload}
        case 'SET_FROM': 
             return {...state, from: action.payload}
        case 'SET_TO':
            return {...state, to: action.payload}
        case 'RESET':
            action.callback();
            return filterState
        default: 
            return state
    }
}

const AdminCustomerFlights = () => {
    const [flights, setFlights] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();
    const [filter, setFilter] = useReducer(filterReducer, filterState);
    const [loading, setLoading] = useState(true);

    const generateCSV = () => {
        const csvRows = [];
        const headers = ['Booking Ref', 'Booked By', 'Flight Number', 
            'Airplane', 'Airline', 'Gate No', 'Departure', 'Departure Time', 
            'Arrival', 'Arrival Time', 'Status', 'Fare Type', 
            'No of Passengers', 'Payment Method', 'Booekd Date'];
        csvRows.push(headers.join(',')); // Add header row

        // Add data rows
        flights.forEach(row => {
          const values = [row.bookingRef, row.booked_by, row.flight.flightNumber, row.flight.airplane, row.flight.airline, row.flight.gate_number,
            `${row.flight.departure.airport}-${row.flight.departure.country}`, formatDate(row.flight.departure.time),
            `${row.flight.arrival.airport}-${row.flight.arrival.country}`, formatDate(row.flight.arrival.time),
            row.flight.status, row.fareType, row.flight.passengers.length, row.payment_method, row.bookDate
        ]
          csvRows.push(values);
        });
    
        // Create a Blob from the CSV string
        const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
    
        // Create a link to download the CSV
        const link = document.createElement('a');
        link.href = csvUrl;
        link.download = 'cloudpeakairlines_customer_flights_report.csv';
        link.click();
      };

    const fetchFlights = async () => {
        setLoading(true);
        dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
        dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
        try{
            const response = await fetch(`/api/flight/flights/customer?page=${state.currentPage}&&limit=50&&searchTerm=${searchTerm}&&status=${filter.status}&&type=${filter.type}&&from=${filter.from}&&to=${filter.to}&&airline=${filter.airline}`);
            if(response.ok){
                const result = await response.json();
                result.currentPage === result.totalPages || result.totalPages === 0 ? dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true}) :  dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: false});
                result.currentPage === 1 ? dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true}) : dispatch({type: 'SET_DISABLED_PREV_BTN', payload: false});
                dispatch({type: 'SET_TOTAL_PAGES', payload: result.totalPages});
                setFlights(result.flights);
            }
        }catch(err){
            console.log(err)
        }
        setLoading(false);
    }

    useEffect(() => {
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
            <div style={{display: 'flex'}}>
                <input type="search" placeholder='Search' style={{marginRight: '30px'}} onChange={(e) => setSearchTerm(e.target.value)}/>
                <CustomerFlightsFilter setFilter={setFilter} filter={filter} filterResults={fetchFlights}/>
            </div>
            <div className="parent-table-container">
                <AdminPagination state={state} dispatch={dispatch} />
                <div className='table-container'>
                {loading && <p className="loading">Please Wait</p>}
                <table>
                    <thead>
                        <tr>
                            <th style={{fontSize: '15px'}}>Booking Ref</th>
                            <th style={{fontSize: '15px'}}>Booked By</th>
                            <th style={{fontSize: '15px'}}>Flight Number</th>
                            <th style={{fontSize: '15px'}}>Airplane</th>
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
                            <th style={{fontSize: '15px'}}>Booked Date</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {flights && !loading && flights.map((flight, i) => {
                            const departureTime = formatDate(flight.flight.departure.time);
                            const arrivalTime = formatDate(flight.flight.arrival.time);

                            return (
                                <tr key={i}>
                                    <td>{flight.bookingRef}</td>
                                    <td>{flight.booked_by}</td>
                                    <td>{flight.flight.flightNumber}</td>
                                    <td>{flight.flight.airplane}</td>
                                    <td>{flight.flight.airline}</td>
                                    <td>{flight.flight.gate_number}</td>
                                    <td>{flight.flight.departure.airport}, {flight.flight.departure.country}</td>
                                    <td>{departureTime}</td>
                                    <td>{flight.flight.arrival.airport}, {flight.flight.arrival.country}</td>
                                    <td>{arrivalTime}</td>
                                    {dataStatus(flight.flight.status)}
                                    <td>{flight.fareType}</td>
                                    <td>{flight.flight.passengers.length}</td>
                                    <td>{flight.payment_method}</td>
                                    <td>{formatDate(flight.bookDate)}</td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>
                </div>
                <button className="add-btn" style={{padding: '7px 50px'}} onClick={generateCSV}>Export</button>
            </div>
        </main>
    )
}

export default AdminCustomerFlights