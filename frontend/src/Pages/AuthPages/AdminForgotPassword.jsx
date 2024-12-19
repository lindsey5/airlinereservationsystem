import { verifyCode } from '../../Service/emailService';
import './UserForgotPassword.css';
import { useEffect, useState } from 'react';

const AdminForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [showVerify, setShowVerify] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [count, setCount] = useState(0);
    const [counter, setCounter] = useState(false);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
            document.title = "Forgot Password | Admin";
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
        const response = await fetch('/api/admin/forgot-password/code',{
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
        if(confirm('Click ok to continue')){
            try{
                const response = await fetch('/api/admin/reset-password',{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email}),
                })
                
                if(response.ok){
                    alert('Password successfully change, please check your email')
                    window.location.href = '/login';
                }else{
                    alert('Failed to change the password');
                }
            }catch(err){
                alert('Failed')
            }
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
                    <h2>Admin Forgot Password</h2>
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
                    <button onClick={resetPassword}>Reset Password</button>
                    </>
                    }
                    {!verified && <button>Submit</button>}
                </form>
            </div>
            <img src="/icons/airplane-bg.png" alt="" />
        </div>
    )
}

export default AdminForgotPassword