import useAdminPaginationReducer from "../../hooks/adminPaginationReducer";
import { useState, useEffect } from "react";
import AdminPagination from "../../Components/Admin/Pagination/AdminPagination";
import '../../styles/TablePage.css';
import AirportForm from "../../Components/Admin/Forms/AirportForm";
import { addAirport, deleteAirport, updateAirport } from "../../Service/AirportService";

const AdminAirports = () => {
    const [airports, setAirports] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();
    const [showAddAirport, setShowAddAirport] = useState(false);
    const [showEditAirport, setShowEditAirport] = useState(false);
    const [airportData, setAirportData] = useState();

    useEffect(() => {
        const fetchAirports = async () => {
            dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
            dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
            try{
                const response = await fetch(`/api/airport/airports/pagination?page=${state.currentPage}&&limit=50&&searchTerm=${searchTerm}`);
                if(response.ok){
                    const result = await response.json();
                    result.currentPage === result.totalPages || result.totalPages === 0 ? dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true}) :  dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: false});
                    result.currentPage === 1 ? dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true}) : dispatch({type: 'SET_DISABLED_PREV_BTN', payload: false});
                    dispatch({type: 'SET_TOTAL_PAGES', payload: result.totalPages});
                    setAirports(result.airports)
                }
            }catch(err){

            }
        }

        fetchAirports();

    },[state.currentPage, searchTerm])

    useEffect(() => {
        dispatch({type:'SET_CURRENT_PAGE', payload: 1})
    }, [searchTerm])

    useEffect(() => {
        document.title = "Airports | Admin";
    }, []);

    return (
        <main className="table-page">
            {showAddAirport && <AirportForm title={'Add Airport'} handleSubmit={addAirport} close={() => setShowAddAirport(false)}/>}
            {showEditAirport && <AirportForm title={'Update Airport'} handleSubmit={updateAirport} close={() => setShowEditAirport(false)} data={airportData}/>}
            <h1>Airports</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <AdminPagination state={state} dispatch={dispatch} />
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Airport</th>
                        <th>Airport Code</th>
                        <th>City / State</th>
                        <th>Country</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {airports && airports.map(airport => 
                    <tr key={airport._id}>
                        <td>{airport.airport}</td>
                        <td>{airport.airport_code}</td>
                        <td>{airport.city}</td>
                        <td>{airport.country}</td>
                        <td>
                            <button onClick={() =>{
                                setShowEditAirport(true)
                                setAirportData({
                                    id: airport._id,
                                    airport: airport.airport,
                                    airport_code: airport.airport_code,
                                    city: airport.city,
                                    country: airport.country
                                })
                            }}>
                                <img src="/icons/editing.png"/>
                            </button>
                            <button onClick={() => deleteAirport(airport._id)}>
                                <img src="/icons/delete.png"/>
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
            <button className='add-btn' onClick={() => setShowAddAirport(true)}>Add Airport</button>
        </main>
    )
}

export default AdminAirports