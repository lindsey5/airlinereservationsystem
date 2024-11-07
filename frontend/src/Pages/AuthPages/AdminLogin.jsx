import React, { useState } from 'react';
import './AdminLoginStyle.css';
import axios from 'axios';

function AdminLogIn() {
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
                // You can redirect the user or perform another action here
            } else {
                console.error('Login failed:');
                // Optionally show a message to the user
            }
        } catch (error) {
            console.error('Error logging in:', error);
            // Handle error, possibly show an error message to the user
        }
    }

    const handleForgetPass = () => {
        
    }

    return(
        <div className='admin-login-page'>
            <div className='cover-color'>
                <div className='login-container'>
                    <h1>ADMIN LOG IN</h1>
                    <input 
                        placeholder='EMPLOYEE ID'
                        type='text' 
                        value={employeeId} 
                        onChange={(e) => setEmpId(e.target.value)} 
                        required 
                    />

                    <input 
                        type='password' 
                        placeholder='UNIQUE PIN' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />

                    <button onClick={handleLogin}>LOG IN</button>
                    <button onClick={handleForgetPass}>Forgot Password</button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogIn;