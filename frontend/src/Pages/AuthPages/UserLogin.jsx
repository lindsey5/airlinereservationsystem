import { useState, useEffect } from 'react'
import './UserLogin.css'
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "User Login";
    },[]);

    const Login = async () => {
    
        try{
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            })
            if(response.ok){
                navigate('/user/home');
            }
            const result = await response.json();
            setError(result.errors[0])
        }catch(err){
            
        }
    
    }

    return (
        <main className="user-login-page">
            <div className='left-section' />
            <div className='right-section'>
                <div className='login-container'>
                    <h1>User Login</h1>
                    <p style={{color: 'red'}}>{error}</p>
                    <div className='input-container'>
                        <input type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                        <input type={showPassword ? 'text' : 'password'} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
                        <div className='show-pass-container'>
                            <input type="checkbox" onChange={() => setShowPassword(!showPassword)}/>Show Password
                        </div>
                    </div>
                    <button className='login-btn' onClick={Login}>Log in</button>
                    <div>
                        <a href="">Forgot Password</a>
                        <a href="/user/signup">Create an Account</a>
                    </div>
                </div>
            </div>
        </main>
    )


}

export default UserLogin