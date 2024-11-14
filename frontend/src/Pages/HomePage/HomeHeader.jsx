import { useNavigate } from "react-router-dom"
import { useState } from "react";
import './HomeHeader.css'

const HomeHeader = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    return(
        <header className='home-header'>
            <div>
                <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                <h3>TCU <span>AIRLINES</span></h3>
            </div>
            <ul>
                <li onClick={() => navigate('/user/login')}>Login</li>
                <li onClick={() => navigate('/user/signup')}>Signup</li>
                <li>About</li>
            </ul>
            <button onClick={() => setShowDropdown(!showDropdown)}>
            <img src="/icons/menu.png" alt="" />
            </button>
            <div className={`dropdown ${showDropdown ? 'show' : ''}`}>
                <li onClick={() => navigate('/user/login')}>Login</li>
                <li onClick={() => navigate('/user/signup')}>Signup</li>
                <li>About</li>
            </div>
        </header>
    )
}

export default HomeHeader