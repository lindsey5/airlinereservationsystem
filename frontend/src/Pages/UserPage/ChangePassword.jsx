import { useState } from 'react';
import './ChangePassword.css';
import useFetch from '../../hooks/useFetch';
import { changeUserPassword } from '../../Service/userService';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        password: '',
        newPassword: '',
        confirmNewPass: ''
    });
    const [showCurrPass, setShowCurrPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
    const { data } = useFetch('/api/user');
    const [error, setError] = useState('');

    const validatePassword = (e) => {
        e.preventDefault();
        setError('')
        if(passwords.newPassword !== passwords.confirmNewPass){
            setError('Password doesn\'t match');
        }else if(passwords.newPassword.length < 8){
            setError(`New password should be 8 characters or above`)
        }else{
            changeUserPassword({...passwords, email: data.email}, setError);
        }
        
    }

    return(
        <div className='change-password'>
             <img src="/icons/rb_1518.png" alt="" />
            <form onSubmit={validatePassword}>
                <div>
                    <p style={{color: 'red'}}>{error}</p>
                    <p>Current Password</p>
                    <input 
                        type={showCurrPass ? 'text' : 'password'} 
                        required
                        value={passwords.password}
                        onChange={(e) => setPasswords(prev => ({...prev, password: e.target.value}))}
                    />
                    <button type='button' onClick={() => setShowCurrPass(prev => !prev)}>
                        <img src={`/icons/${showCurrPass ? 'eye (1)' : 'hidden'}.png`} alt="" />
                    </button>
                </div>
                <div>
                    <p>New Password</p>
                    <input 
                        type={showNewPass ? 'text' : 'password'} 
                        required
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords(prev => ({...prev, newPassword: e.target.value}))}
                    />
                    <button type='button' onClick={() => setShowNewPass(prev => !prev)}>
                        <img src={`/icons/${showNewPass ? 'eye (1)' : 'hidden'}.png`} alt="" />
                    </button>
                </div>
                <div>
                    <p>Confirm New Password</p>
                    <input
                        type={showConfirmNewPass ? 'text' : 'password'} 
                        required
                        value={passwords.confirmNewPass}
                        onChange={(e) => setPasswords(prev => ({...prev, confirmNewPass: e.target.value}))}
                    />
                    <button type='button' onClick={() => setShowConfirmNewPass(prev => !prev)}>
                        <img src={`/icons/${showConfirmNewPass ? 'eye (1)' : 'hidden'}.png`} alt="" />
                    </button>
                </div>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default ChangePassword