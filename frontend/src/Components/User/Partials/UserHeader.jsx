import { useNavigate } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import './UserHeader.css'
import { useContext, useState } from 'react';
import { SettingsContext } from '../../../Context/SettingsContext';
import useFetch from '../../../hooks/useFetch';

const UserHeader = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const logout = useLogout('/');
    const { setShowSettings } = useContext(SettingsContext);
    const {data} = useFetch('/api/user');

    return (
        <header>
            <div onClick={() => navigate('/user/home')}>
                <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                <h3>CLOUDPEAK <span>AIRLINES</span></h3>
            </div>
            <div className='right-container'>
                <p>{data?.email}</p>
                <button onClick={() => setShowDropdown(!showDropdown)}><img src="/icons/profile.png" alt="" /></button>
            </div>
            {showDropdown && 
            <div className='dropdown'>
                <a href="/user/flights">
                    <button><img src="/icons/plane.png" alt="" />My Flights</button>
                </a>
                <button onClick={() => setShowSettings(true)}><img src="/icons/settings (1).png" alt="" />Settings</button>
                <button onClick={logout}><img src="/icons/logout.png" alt="" />Log out</button>
            </div>}
        
        </header>
    )
}

export default UserHeader