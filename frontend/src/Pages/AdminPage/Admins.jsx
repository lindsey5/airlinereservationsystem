import useAdminPaginationReducer from "../../hooks/adminPaginationReducer";
import { useState, useEffect } from "react";
import AdminPagination from "../../Components/Admin/Pagination/AdminPagination";
import '../../styles/TablePage.css';
import AddAdminForm from "../../Components/Admin/Forms/AddAdminForm";
import AddAdminSuccess from "../../Components/Modals/AddAdminSuccess";
import { addAdmin, deleteAdmin } from "../../Service/AdminService";

const Admins = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();
    const [admins, setAdmins] = useState();
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const fetchAirplanes = async () => {
            dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
            dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
            try{
                const response = await fetch(`/api/admin/admins?page=${state.currentPage}&&limit=50&&searchTerm=${searchTerm}`);
                if(response.ok){
                    const result = await response.json();
                    result.currentPage === result.totalPages || result.totalPages === 0 ? dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true}) :  dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: false});
                    result.currentPage === 1 ? dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true}) : dispatch({type: 'SET_DISABLED_PREV_BTN', payload: false});
                    dispatch({type: 'SET_TOTAL_PAGES', payload: result.totalPages});
                    setAdmins(result.admins)
                }
            }catch(err){

            }
        }
        fetchAirplanes();
    },[state.currentPage, searchTerm])

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if(confirm('Click ok to continue')){
            const response = await addAdmin(e);
            if(response.errors){
                alert(response.errors[0]);
            }else{
                setShowSuccessModal(true)
                setShowAddAdmin(false);
            }
        }
    }

    return (
        <main className="table-page">
            {showAddAdmin && <AddAdminForm close={() => setShowAddAdmin(false)} handleSubmit={handleAddAdmin}/>}
            {showSuccessModal && <AddAdminSuccess close={() => window.location.reload()}/>}
            <h1>Admins</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <AdminPagination state={state} dispatch={dispatch} />
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Employee Id</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {admins && admins.map(admin => 
                    <tr key={admin._id}>
                        <td>{admin.employeeId}</td>
                        <td>{admin.firstname}</td>
                        <td>{admin.lastname}</td>
                        <td>{admin.email}</td>
                        <td>
                            <button onClick={() => deleteAdmin(admin._id)}><img src="/icons/delete.png" alt="" /></button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
            <button className='add-btn' onClick={() => setShowAddAdmin(true)}>Add Admin</button>
        </main>
    )
}

export default Admins