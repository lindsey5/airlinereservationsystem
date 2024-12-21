import './AdminHeader.css';
import { SideBarContext } from "../../../Context/SideBarContext";
import { useContext } from 'react';
import Notifications from '../Notifications/Notifications';
import useFetch from '../../../hooks/useFetch';

const AdminHeader = ({socket, setFlightData}) => {
    const { setShowSideBar } = useContext(SideBarContext);
    const { data } = useFetch('/api/admin')

    return (
        <header className="admin-header">
            <div className='logo-container'>
                <button onClick={() => setShowSideBar(prev => !prev)}><img src="/icons/burger-bar.png" alt="" /></button>
                <img src="/icons/tcu_airlines-logo (2).png"/>
                <h3>Admin</h3>
            </div>
            <div className='right-container'>
                <p>{data?.email}</p>
                <Notifications socket={socket} setFlightData={setFlightData}/>
            </div>
        </header>
    )

} 

export default AdminHeader;