import { useEffect, useState } from 'react';
import '../../styles/TablePage.css';
import AirplaneForm from '../../Components/Admin/Forms/AirplaneForm';
import { addAirplane, deleteAirplane, updateAirplane } from '../../Service/Admin/AdminAirplaneService';
import useAdminPaginationReducer from '../../hooks/adminPaginationReducer';
import AdminPagination from '../../Components/Admin/Pagination/AdminPagination';
import { dataStatus } from '../../utils/dataStatus';

const AdminAirplanes = () => {
    const [airplanes, setAirplanes] = useState();
    const [showAddAirplane, setShowAddAirplane] = useState(false);
    const [showEditAirplane, setShowEditAirplane] = useState(false);
    const [airplaneData, setAirplaneData] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();

    useEffect(() => {
        const fetchAirplanes = async () => {
            dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
            dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
            try{
                const response = await fetch(`/api/airplane/airplanes?page=${state.currentPage}&&limit=50&&searchTerm=${searchTerm}`);
                if(response.ok){
                    const result = await response.json();
                    result.currentPage === result.totalPages || result.totalPages === 0 ? dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true}) :  dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: false});
                    result.currentPage === 1 ? dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true}) : dispatch({type: 'SET_DISABLED_PREV_BTN', payload: false});
                    dispatch({type: 'SET_TOTAL_PAGES', payload: result.totalPages});
                    setAirplanes(result.airplanes)
                }
            }catch(err){

            }
        }

        fetchAirplanes();

    },[state.currentPage, searchTerm])

    useEffect(() => {
        document.title = "Airplanes | Admin";
    }, []);

    return (
        <main className="table-page">
            {showAddAirplane && <AirplaneForm handleSubmit={addAirplane} close={() => setShowAddAirplane(false)} title={'Add Airplane'}/>}
            {showEditAirplane && <AirplaneForm data={airplaneData} handleSubmit={updateAirplane} close={() => setShowEditAirplane(false)} title={'Update Airplane'}/>}
            <h1>Airplanes</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <AdminPagination state={state} dispatch={dispatch} />
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Model</th>
                        <th>Current Location</th>
                        <th>Passenger Seat Capacity</th>
                        <th>Columns</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {airplanes && airplanes.map(airplane => 
                    <tr key={airplane._id}>
                        <td>{airplane._id}</td>
                        <td>{airplane.model}</td>
                        <td>{airplane.currentLocation}</td>
                        <td>{airplane.passengerSeatingCapacity}</td>
                        <td>{airplane.columns}</td>
                        {dataStatus(airplane.status)}
                        <td>
                            <button onClick={() =>{
                                setShowEditAirplane(true)
                                setAirplaneData({
                                    id: airplane._id,
                                    model: airplane.model,
                                    seatCapacity: airplane.passengerSeatingCapacity,
                                    columns: airplane.columns,
                                    status: airplane.status,
                                    currentLocation: airplane.currentLocation
                                })
                            }}>
                                <img src="/icons/editing.png"/>
                            </button>
                            <button onClick={() => deleteAirplane(airplane._id)}>
                                <img src="/icons/delete.png"/>
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
            <button className='add-btn' onClick={() => setShowAddAirplane(true)}>Add Airplane</button>
        </main>
    )

}

export default AdminAirplanes