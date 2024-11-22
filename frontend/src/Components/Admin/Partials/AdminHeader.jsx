import './AdminHeader.css';
import { SideBarContext } from "../../../Context/sideBarContext";
import { useContext } from 'react';

const AdminHeader = () => {
    const { setShowSideBar } = useContext(SideBarContext);

    return (
        <header className="admin-header">
            <div className='logo-container'>
            <button onClick={() => setShowSideBar(prev => !prev)}><img src="/icons/burger-bar.png" alt="" /></button>
                <img src="/icons/tcu_airlines-logo (2).png"/>
                <h3>Admin</h3>
            </div>
        </header>
    )

} 

export default AdminHeader;