import { useState } from 'react'
import './UserLogin.css'

const UserLogin = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="user-login-page">
            <div className='left-section' />
            <div className='right-section'>
                <div className='login-container'>
                    <h1>User Login</h1>
                    <div className='input-container'>
                        <input type="text" placeholder='Username' />
                        <input type={showPassword ? 'text' : 'password'} placeholder='Password' />
                        <div className='show-pass-container'>
                            <input type="checkbox" onChange={() => setShowPassword(!showPassword)}/>Show Password
                        </div>
                    </div>
                    <button className='login-btn'>Log in</button>
                    <div>
                        <a href="">Forgot Password</a>
                        <a href="">Create an Account</a>
                    </div>
                </div>
            </div>
        </main>
    )


}

export default UserLogin