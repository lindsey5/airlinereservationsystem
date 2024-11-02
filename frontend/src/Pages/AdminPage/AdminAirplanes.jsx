import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch'
import './AdminPage.css'
import AirplaneForm from '../../Components/Admin/AirplaneForm';
import { addAirplane, deleteAirplane, updateAirplane } from '../../Service/Admin/AdminAirplaneService';

const AdminAirplanes = () => {
    const { data } = useFetch('/api/airplane/airplanes');
    const [airplanes, setAirplanes] = useState();
    const [showAddAirplane, setShowAddAirplane] = useState(false);
    const [showEditAirplane, setShowEditAirplane] = useState(false);
    const [airplaneData, setAirplaneData] = useState();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(()=>{
        if(data){
            setAirplanes(data);
        }
    }, [data])

    const filterTable = (airplane) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase(); 
        return (
            airplane._id.toLowerCase().includes(lowerCaseSearchTerm) ||
            airplane.model.toLowerCase().includes(lowerCaseSearchTerm) ||
            airplane.passengerSeatingCapacity.toString().includes(lowerCaseSearchTerm) || 
            airplane.columns.includes(lowerCaseSearchTerm) || 
            airplane.status.toLowerCase().includes(lowerCaseSearchTerm)
        );
    };

    useEffect(() => {
        if(data && searchTerm){
            setAirplanes(data.filter(filterTable))
        }else{
            setAirplanes(data)
        }
    }, [searchTerm])


    return (
        <main className="admin-page">
            {showAddAirplane && <AirplaneForm handleSubmit={addAirplane} close={() => setShowAddAirplane(false)} title={'Add Airplane'}/>}
            {showEditAirplane && <AirplaneForm data={airplaneData} handleSubmit={updateAirplane} close={() => setShowEditAirplane(false)} title={'Update Airplane'}/>}
            <h1>Airplanes</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Model</th>
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
                        <td>{airplane.passengerSeatingCapacity}</td>
                        <td>{airplane.columns}</td>
                        <td>{airplane.status}</td>
                        <td>
                            <button onClick={() =>{
                                setShowEditAirplane(true)
                                setAirplaneData({
                                    id: airplane._id,
                                    model: airplane.model,
                                    seatCapacity: airplane.passengerSeatingCapacity,
                                    columns: airplane.columns,
                                    status: airplane.status
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
            <button className='add-btn' onClick={() => setShowAddAirplane(true)}>Add Pilot</button>
        </main>
    )

}

export default AdminAirplanes