import { useNavigate } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import './UserHeader.css'
import { useState } from 'react';

const UserHeader = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const logout = useLogout();

    return (
        <header>
            <div onClick={() => navigate('/user/home')}>
                <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                <h3>CLOUDPEAK <span>AIRLINES</span></h3>
            </div>
            <button onClick={() => setShowDropdown(!showDropdown)}><img src="/icons/profile.png" alt="" /></button>
            {showDropdown && 
            <div className='dropdown'>
                <a href="/user/flights">
                    <button><img src="/icons/plane.png" alt="" />Your Flights</button>
                </a>
                <a href="">
                    <button><img src="/icons/settings (1).png" alt="" />Settings</button>
                </a>
                <button onClick={logout}><img src="/icons/logout.png" alt="" />Log out</button>
            </div>}
        
        </header>
    )
}

export default UserHeader