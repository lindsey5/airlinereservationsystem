import React, { useState } from 'react';
import './AdminLoginStyle.css';
import axios from 'axios';
import { handleBlur, handleFocus } from '../../utils/handleInput';

function AdminLogin() {
    const [employeeId, setEmpId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            // Send a POST request to your Node.js server
            const response = await axios.post('/admin-login', {
                employeeId,
                password,
            });

            // Check if the login was successful
            if (response.data.success) {
                console.log('Login successful');
            } else {
                console.error('Login failed:');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }


    return(
        <div className='admin-login-page'>
                <div className='login-container'>
                    <img src="/icons/user (2).png" alt="" />
                    <h1>Admin Login</h1>
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
                <button onClick={handleLogin}>LOG IN</button>
            </div>
        </div>
    );
}

export default AdminLogin;