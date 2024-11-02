import useFetch from '../../hooks/useFetch';
import './AdminPage.css'
import PilotForm from '../../Components/Admin/PilotForm';
import { useEffect, useState } from 'react';
import { addPilot, deletePilot, updatePilot } from '../../Service/Admin/AdminPilotService';

const AdminPilots = () => {
    const { data } = useFetch('/api/pilot/pilots');
    const [showAddPilot, setShowAddPilot] = useState(false);
    const [pilotData, setPilotData] = useState(false);
    const [showEditPilot, setShowEditPilot] = useState(false);
    const [pilots, setPilots] = useState();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if(data){
            setPilots(data);
        }
    }, [data])


    const filterTable = (pilot) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase(); 
        const fullname = pilot.firstname.toLowerCase() + ' ' + pilot.lastname.toLowerCase();
        return (
            fullname.includes(lowerCaseSearchTerm) ||
            pilot._id.toLowerCase().includes(lowerCaseSearchTerm) ||
            pilot.age.toString().includes(lowerCaseSearchTerm) ||
            new Date(pilot.dateOfBirth).toISOString().split('T')[0].includes(lowerCaseSearchTerm) ||
            pilot.nationality.toLowerCase().includes(lowerCaseSearchTerm) ||
            pilot.status.toLowerCase().includes(lowerCaseSearchTerm)
        );
    };

    useEffect(() => {
        if(data && searchTerm){
            setPilots(data.filter(filterTable))
        }else{
            setPilots(data)
        }
    }, [searchTerm])
    
    return (
        <main className="admin-page">
            {showAddPilot && <PilotForm close={() => setShowAddPilot(false)} handleSubmit={addPilot} title={'Add Pilot'}/>}
            {showEditPilot && <PilotForm close={() => setShowEditPilot(false)} handleSubmit={updatePilot} data={pilotData} title={'Update Pilot'}/>}
            <h1>Pilots</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
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
                        <td>{pilot.firstname} {pilot.lastname}</td>
                        <td>{pilot.age}</td>
                        <td>{new Date(pilot.dateOfBirth).toISOString().split('T')[0]}</td>
                        <td>{pilot.nationality}</td>
                        <td>{pilot.status}</td>
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