import { Link } from 'react-router-dom'
import './UserSignup.css'
import {  sendSignupVerificationCode, verifyCode } from '../../Service/Email/emailService'
import {  useState } from 'react'
import { handleNegativeAndDecimal } from '../../utils/handleInput'
import { signupUser } from '../../Service/User/userService'

const UserSignup = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        confirmPass: '',
        age: '',
        gender: 'Male',
    })
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPass: false,
    })
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [showEmail, setShowEmail] = useState(true);
    const [showVerify, setShowVerify] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOtherDetails, setShowOtherDetails] = useState(false);

    const sendCodeToEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setCode(['', '', '', '', '', '']);
        const result = await sendSignupVerificationCode(userData.email);
        if(result.errors){
            setError(result.errors[0]);
        }else{
            setShowEmail(false)
            setShowVerify(true)
        }

        setLoading(false)
    } 

    const handleCode = (e, index) => {
        const valueStr = e.target.value.toString();
            setCode(prev => {
                const newCode = [...prev];
                newCode[index] = valueStr.charAt(valueStr.length -1);
                return newCode;
            });
    };

    const verifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        const combinedCode = code.join('');
        const result = await verifyCode(combinedCode);

        if(result.errors){
            setError(`*${result.errors[0]}`)
        }else{
            setShowVerify(false);
            setShowOtherDetails(true);
        }
        
    }

    const validate = async (e) => {
        e.preventDefault();
        if(userData.password !== userData.confirmPass){
            setError('Password doesn\'t match');
        }else if(userData.password.length < 8){
            setError(`*Password should be 8 characters or above`)
        }else{
            const {confirmPass, ...data} = userData;
            signupUser(data);
        }
    }

    return (
        <div className="user-signup">
            <img className='left-img' src="/icons/background.jpg" alt="" />
            <div className='right-container'>
                <div className='container'>
                <h1>User Signup</h1>
                {loading && <div className="loader"></div>}
                <div className='input-container'>
                    {showEmail && !loading && 
                        <form onSubmit={sendCodeToEmail}>
                            <p style={{color: 'red'}}>{error}</p>
                            <input type="email"  required placeholder='Email' onChange={(e) => setUserData(prev => ({...prev, email: e.target.value}))}/>
                            
                            <button type='submit'>Submit</button>
                        </form>
                    }
                    { showVerify && !loading &&
                    <form onSubmit={verifyEmail}>
                        <p>A Verification code has been sent to </p>
                        <p style={{fontWeight: '600'}}>{userData.email}</p>
                        <p>Code expires in 30 seconds</p>
                        <p style={{color: 'red'}}>{error}</p>
                        <div className='email-code'>
                        <input
                            type="number"
                            value={code[0]}
                            min="0"
                            max="9"
                            onKeyPress={handleNegativeAndDecimal}
                            onChange={(e) => handleCode(e, 0)}
                            />
                            <input
                            type="number"
                            value={code[1]}
                            min="0"
                            max="9"
                            onKeyPress={handleNegativeAndDecimal}
                            onChange={(e) => handleCode(e, 1)}
                            />
                        <input
                            type="number"
                            value={code[2]}
                            min="0"
                            max="9"
                            onKeyPress={handleNegativeAndDecimal}
                            onChange={(e) => handleCode(e, 2)}
                        />
                        <input
                            type="number"
                            value={code[3]}
                            min="0"
                            max="9"
                            onKeyPress={handleNegativeAndDecimal}
                            onChange={(e) => handleCode(e, 3)}
                        />
                        <input
                            type="number"
                            value={code[4]}
                            min="0"
                            max="9"
                            onKeyPress={handleNegativeAndDecimal}
                            onChange={(e) => handleCode(e, 4)}
                        />
                        <input
                            type="number"
                            value={code[5]}
                            min="0"
                            max="9"
                            onKeyPress={handleNegativeAndDecimal}
                            onChange={(e) => handleCode(e, 5)}
                        />
                        </div>
                        <button type='submit'>Verify</button>
                        <div className='option'>
                            <p onClick={sendCodeToEmail}
                            >Resend</p>
                            <p onClick={() => {
                                setShowEmail(true)
                                setShowVerify(false)
                            }}>Change Email</p>
                        </div>
                    </form>
                    }
                    { showOtherDetails && 
                    <form onSubmit={validate}>
                        <p style={{color: 'red'}}>{error}</p>
                        <div className='password'>
                            <input 
                                type={showPassword.password ? 'text' : 'password'}
                                placeholder='New Password'
                                required
                                onChange={(e) => setUserData(prev => ({...prev, password: e.target.value}))}
                            />
                            <img 
                                onClick={() => setShowPassword(prev => ({...prev, password: !prev.password}))} 
                                src={`/icons/${showPassword.password ? 'hidden' : 'eye (1)'}.png`} alt="" />
                        </div>
                        <div  className='password'>
                            <input 
                                type={showPassword.confirmPass ? 'text' : 'password'} 
                                placeholder='Confirm Password'
                                required
                                onChange={(e) => setUserData(prev => ({...prev, confirmPass: e.target.value}))}
                            />
                            <img 
                                onClick={() => setShowPassword(prev => ({...prev, confirmPass: !prev.confirmPass}))} 
                                src={`/icons/${showPassword.confirmPass ? 'hidden' : 'eye (1)'}.png`} alt="" />
                        </div>
                        
                        <div className='other-details'>
                            <input 
                                type="number" min='1'  
                                placeholder='Age'
                                onChange={(e) => setUserData(prev => ({...prev, age: e.target.value}))}
                                required onKeyPress={handleNegativeAndDecimal}
                            />
                            <select >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            </select>
                        </div>
                        <button type='submit'>Submit</button>
                    </form>
                    }
                </div>
                <div>
                    {!showVerify && <p style={{marginTop: '30px'}}>Already have an account? <Link to={'/user/login'}>Login</Link></p>}
                </div>
                </div>
            </div>
        </div>
    )
}

export default UserSignup