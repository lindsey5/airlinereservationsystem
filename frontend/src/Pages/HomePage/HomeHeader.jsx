import { useNavigate } from "react-router-dom"
import { useState } from "react";
import './HomeHeader.css'

const HomeHeader = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    return(
        <header className='home-header'>
            <div onClick={() => navigate('/')}>
                <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                <h3>TCU <span>AIRLINES</span></h3>
            </div>
            <ul>
                <li onClick={() => navigate('/user/login')}>Log in</li>
                <li onClick={() => navigate('/user/signup')}>Sign up</li>
                <li onClick={() => navigate('/about')}>About us</li>
            </ul>
            <button onClick={() => setShowDropdown(!showDropdown)}>
            <img src="/icons/menu.png" alt="" />
            </button>
            <div className={`dropdown ${showDropdown ? 'show' : ''}`}>
                <li onClick={() => navigate('/user/login')}>Log in</li>
                <li onClick={() => navigate('/user/signup')}>Sign up</li>
                <li onClick={() => navigate('/about')}>About us</li>
            </div>
        </header>
    )
}

export default HomeHeader