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
            // Create a UTF-8 encoded byte array from the string
            const encoder = new TextEncoder();
            const uint8Array = encoder.encode(email);
            
            // Convert the byte array to a Base64 encoded string
            let binary = '';
            uint8Array.forEach(byte => binary += String.fromCharCode(byte));
            const data = btoa(binary)

            const response = await fetch('/api/forgot-password',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data, email}),
            })
            
            if(response.ok){
                setVerified(true);
            }else{
                alert('Verification Failed')
            }
    
        }
    }

    return(
        <div className="user-forgot-password">
            <div className='left-container'>
                <form className='container' onSubmit={!showVerify ? sendVerificationCode : verifySentCode}>
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
                    <button>Submit</button>
                    </>
                    :
                    <>         
                    <h2>Email Verified!</h2>
                    <h3>Please Check your email</h3>
                    <a href="/user/login" style={{marginTop: '30px'}}>Go Back To Login</a>
                    </>
                    }
                </form>
            </div>
            <img src="/icons/airplane-bg.png" alt="" />
        </div>
    )
}

export default UserForgotPassword