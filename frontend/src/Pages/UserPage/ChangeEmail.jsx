import { useState } from 'react'
import './ChangeEmail.css'
import { sendVerificationCode, verifyCode } from '../../Service/emailService';
import { updateUser } from '../../Service/userService';

const ChangeEmail = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [showSecondForm, setShowSecondForm] = useState(false);
    const [code, setCode] = useState();

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleCode = (e) => {
        setCode(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSendCode = async () =>{
        setError('')
        const response = await sendVerificationCode(email);
        if(response.errors){
            setError(response.errors[0])
        }else{
            setShowSecondForm(true)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('')
        if(!showSecondForm){
            await handleSendCode();
        }else{
            const response = await verifyCode(code);
            if(response.errors){
                setError(response.errors[0])
            }else{
                await updateUser({email})
            }
        }
    }

    return(
        <div className="change-email">
            <form className='container' onSubmit={handleSubmit}>
                <h1>Change Email</h1>
                <p className='error'>{error}</p>
                {!showSecondForm ? 
                <div className='input-container'>
                    <input type="email" placeholder='Enter new email' required onChange={handleEmail}/>
                    <span>Enter new email</span>
                </div> :
                <>
                    <p>A Verification code has been sent to </p>
                    <p>{email}</p>
                    <div className='input-container'>
                        <input type="number" placeholder='Enter code' required onChange={handleCode}/>
                        <span>Enter code</span>
                    </div>
                    <button className='resend-btn' type='button' onClick={handleSendCode}>Resend</button>
                </>
                }
                <button className='submit-btn'>Submit</button>
            </form>
            <img src="/icons/rb_2148310396.png" alt="" />
        </div>
        
    )
}

export default ChangeEmail