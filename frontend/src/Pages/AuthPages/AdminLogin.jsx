import React, { useRef, useState } from 'react';
import './AdminLoginStyle.css';
import { handleBlur, handleFocus } from '../../utils/handleInput';
import { adminLogin, frontDeskLogin } from '../../utils/loginUtils';

function AdminLogin() {
    const [employeeId, setEmpId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userType, setUserType] = useState('Admin');
    const userTypeRef = useRef([]);

    const handleLogin = async () => {
        userType === 'Admin' ? await adminLogin(employeeId, password, setError) : await frontDeskLogin(employeeId, password, setError);
    }

    const handleUserType = (index, typeOfUser) => {
        for(let i =0; i < userTypeRef.current.length; i++){
            userTypeRef.current[i].classList.remove('selected');
        }
        userTypeRef.current[index].classList.add('selected')
        setUserType(typeOfUser)
        setError('');
    }

    return(
        <div className='admin-login-page'>
                <div className='login-container'>
                    <img src="/icons/user (2).png" alt="" />
                    <h2>{userType} Login</h2>
                    <div className='user-btn-container'>
                        <button className='selected' ref={(e) => userTypeRef.current[0] = e} onClick={() => handleUserType(0, 'Admin')}>Admin</button>
                        <button ref={(e) => userTypeRef.current[1] = e} onClick={() => handleUserType(1, 'Front Desk')}>Front Desk</button>
                    </div>
                    {error && <p>{error}</p>}
                    <div>
                        <div className='input-container'>
                            <input 
                                placeholder='Employee ID'
                                type='text' 
                                value={employeeId} 
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={(e) => setEmpId(e.target.value)} 
                                required 
                            />
                            <span>Employee ID</span>
                        </div>
                        <div className='input-container'>
                            <input 
                                type='password'
                                placeholder='Password' 
                                value={password} 
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                        />
                        <span>Password</span>
                    </div>
                </div>
                <button className='login-btn' onClick={handleLogin}>LOG IN</button>
                <a href={userType === 'Admin' ? '/admin/forgot-password' : '/frontdesk/forgot-password'}>Forgot Password</a>
            </div>
        </div>
    );
}

export default AdminLogin;