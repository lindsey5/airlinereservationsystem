import useAdminPaginationReducer from "../../hooks/adminPaginationReducer";
import { useState, useEffect } from "react";
import AdminPagination from "../../Components/Admin/Pagination/AdminPagination";
import '../../styles/TablePage.css';
import { addFrontDeskAgent, deleteFrontDeskAgent } from "../../Service/FrontDeskService";
import AddFrontDeskForm from "../../Components/Admin/Forms/AddFrontDeskForm";
import AddFrontDeskSuccess from "../../Components/Admin/Modals/AddFrontDeskSuccess";

const FrontDeskAgents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();
    const [agents, setAgents] = useState();
    const [showAddAgent, setShowAddAgent] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const fetchAirplanes = async () => {
            dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
            dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
            try{
                const response = await fetch(`/api/front-desk/front-desks?page=${state.currentPage}&&limit=50&&searchTerm=${searchTerm}`);
                if(response.ok){
                    const result = await response.json();
                    result.currentPage === result.totalPages || result.totalPages === 0 ? dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true}) :  dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: false});
                    result.currentPage === 1 ? dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true}) : dispatch({type: 'SET_DISABLED_PREV_BTN', payload: false});
                    dispatch({type: 'SET_TOTAL_PAGES', payload: result.totalPages});
                    setAgents(result.frontdesks)
                }
            }catch(err){

            }
        }
        fetchAirplanes();
    },[state.currentPage, searchTerm])

    const handleAddAgent = async (e) => {
        e.preventDefault();
        if(confirm('Click ok to continue')){
            const response = await addFrontDeskAgent(e);
            if(response.errors){
                alert(response.errors[0]);
            }else{
                setShowSuccessModal(true)
                setShowAddAgent(false);
            }
        }
    }

    return (
        <main className="table-page">
            {showAddAgent && <AddFrontDeskForm close={() => setShowAddAgent(false)} handleSubmit={handleAddAgent}/>}
            {showSuccessModal && <AddFrontDeskSuccess close={() => window.location.reload()}/>}
            <h1>Front Desk Agents</h1>
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
                {agents && agents.map(agent => 
                    <tr key={agent._id}>
                        <td>{agent.employeeId}</td>
                        <td>{agent.firstname}</td>
                        <td>{agent.lastname}</td>
                        <td>{agent.email}</td>
                        <td>
                            <button onClick={() => deleteFrontDeskAgent(agent._id)}><img src="/icons/delete.png" alt="" /></button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
            <button className='add-btn' onClick={() => setShowAddAgent(true)}>Add Agent</button>
        </main>
    )
}

export default FrontDeskAgents