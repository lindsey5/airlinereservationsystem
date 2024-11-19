import './AdminPage.css'
import PilotForm from '../../Components/Admin/Forms/PilotForm';
import { useEffect, useState } from 'react';
import { addPilot, deletePilot, updatePilot } from '../../Service/Admin/AdminPilotService';
import AdminPagination from '../../Components/Admin/Pagination/AdminPagination';
import useAdminPaginationReducer from '../../hooks/adminPaginationReducer';
import { dataStatus } from '../../utils/dataStatus';

const AdminPilots = () => {
    const [showAddPilot, setShowAddPilot] = useState(false);
    const [pilotData, setPilotData] = useState(false);
    const [showEditPilot, setShowEditPilot] = useState(false);
    const [pilots, setPilots] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();

    useEffect(() => {
        const fetchPilots = async () => {
            dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
            dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
            try{
                const response = await fetch(`/api/pilot/pilots?page=${state.currentPage}&&limit=50&&searchTerm=${searchTerm}`);
                if(response.ok){
                    const result = await response.json();
                    result.currentPage === result.totalPages || result.totalPages === 0 ? dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true}) :  dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: false});
                    result.currentPage === 1 ? dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true}) : dispatch({type: 'SET_DISABLED_PREV_BTN', payload: false});
                    dispatch({type: 'SET_TOTAL_PAGES', payload: result.totalPages});
                    setPilots(result.pilots)
                }
            }catch(err){

            }
        }

        fetchPilots();

    },[state.currentPage, searchTerm])

    useEffect(() => {
        document.title = "Pilots | Admin";
    }, []);

    useEffect(() => {
        dispatch({type:'SET_CURRENT_PAGE', payload: 1})
    }, [searchTerm])
    
    return (
        <main className="admin-page">
            {showAddPilot && <PilotForm close={() => setShowAddPilot(false)} handleSubmit={addPilot} title={'Add Pilot'}/>}
            {showEditPilot && <PilotForm close={() => setShowEditPilot(false)} handleSubmit={updatePilot} data={pilotData} title={'Update Pilot'}/>}
            <h1>Pilots</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <AdminPagination state={state} dispatch={dispatch} />
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Age</th>
                        <th>Date of Birth</th>
                        <th>Nationality</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {pilots && pilots.map(pilot => 
                    <tr key={pilot._id}>
                        <td>{pilot._id}</td>
                        <td>{pilot.firstname}</td>
                        <td>{pilot.lastname}</td>
                        <td>{pilot.age}</td>
                        <td>{new Date(pilot.dateOfBirth).toISOString().split('T')[0]}</td>
                        <td>{pilot.nationality}</td>
                        {dataStatus(pilot.status)}
                        <td>
                            <button onClick={() =>{
                                setShowEditPilot(true);
                                setPilotData({
                                    id: pilot._id,
                                    firstname: pilot.firstname,
                                    lastname: pilot.lastname,
                                    age: pilot.age,
                                    dateOfBirth: new Date(pilot.dateOfBirth).toISOString().split('T')[0],
                                    nationality: pilot.nationality,
                                    status: pilot.status,
                                })
                            }}>
                                <img src="/icons/editing.png"/>
                            </button>
                            <button onClick={() => deletePilot(pilot._id)}>
                                <img src="/icons/delete.png"/>
                            </button>
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
            </div>
            <button className='add-btn' onClick={() => setShowAddPilot(true)}>Add Pilot</button>
        </main>
    )
}

export default AdminPilots;