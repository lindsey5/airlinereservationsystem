import { verifyCode } from '../../Service/emailService';
import './UserForgotPassword.css';
import { useEffect, useState } from 'react';

const UserForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [showVerify, setShowVerify] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [count, setCount] = useState(0);
    const [counter, setCounter] = useState(false);
    const [verified, setVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    useEffect(() => {
            document.title = "Forgot Password";
    },[]);

    useEffect(() => {
        let intervalId;
        if (counter) {
            intervalId = setInterval(() => {
                setCount(prev => {
                    if (prev > 0) {
                        return prev - 1;
                    } else {
                        clearInterval(intervalId); 
                        return prev; 
                    }
                });
            }, 1000);
        }

    }, [counter]);

    const sendVerificationCode = async (e) => {
        e.preventDefault();
        setError('');
        setCounter(false);
        const response = await fetch('/api/forgot-password/code',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email}),
        })
        
        const result = await response.json();
        if(response.ok){
            setShowVerify(true);
            setCounter(true);
            setCount(60);
        }

        if(result.errors){
            setError(result.errors[0]);
        }
    }

    const verifySentCode = async (e) => {
        e.preventDefault();
        setError('');
        const response = await verifyCode(code);
        if(response.errors){
            setError(response.errors[0])
        }else{
            setVerified(true);
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault();
        setError('')
        if(newPassword === confirmPass){
            try{
                const response = await fetch('/api/user/reset-password',{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, newPassword}),
                })
                
                if(response.ok){
                    alert('Password successfully change')
                    window.location.href = '/user/login';
                }else{
                    alert('Failed to change the password');
                }
            }catch(err){
                alert('Failed')
            }
        }else{
            setError('Password does\'nt match')
        }
    }

    return(
        <div className="user-forgot-password">
            <div className='left-container'>
                <form className='container' onSubmit={!showVerify ? 
                    sendVerificationCode : 
                    (!verified ? verifySentCode : resetPassword)}>
                    <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                    {!verified ?
                    <>
                    <h2>Forgot Password</h2>
                    <p>{error}</p>
                    {!showVerify ? 
                    <div>
                        <p>Email Address</p>
                        <input type="email"  required onChange={(e) => setEmail(e.target.value)}/>
                    </div> :
                    <div>
                        <p>Code expires in {count} seconds</p>
                        <p>Enter Code</p>
                        <input type="number" required onChange={(e) => setCode(e.target.value)}/>
                        <button onClick={sendVerificationCode}>Resend</button>
                    </div>
                    }
                    </>
                    :
                    <>         
                    <h2>Reset Your Password</h2>
                    <p>{error}</p>
                    <div>
                        <p>New Password</p>
                        <input type="password" required onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>
                    <div>
                        <p>Confirm New Password</p>
                        <input type="password" required onChange={(e) => setConfirmPass(e.target.value)} />
                    </div>
                    </>
                    }
                    <button>Submit</button>
                </form>
            </div>
            <img src="/icons/airplane-bg.png" alt="" />
        </div>
    )
}

export default UserForgotPassword