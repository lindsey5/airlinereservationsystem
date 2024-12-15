import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ResetPassword.css'

const ResetPassword = () => {
    const queryParams = new URLSearchParams(window.location.search); // Create a new URLSearchParams object to parse the query string from the current URL
    const encodedData = queryParams.get('data');  // Retrieve the value of the 'data' parameter from the query string
    const email = window.atob(decodeURIComponent(encodedData));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const navigate = useNavigate();
 
    const resetPassword = async (e) => {
        e.preventDefault();
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
                   navigate('/user/login');
                }else{
                    alert('Failed to change the password');
                }
            }catch(err){
                alert('Failed')
            }
        }else{
            alert('Password does\'nt match')
        }
    }

    return(
        <div className="reset-password">
            <form onSubmit={resetPassword}>
            <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                <h2>Reset Your Password</h2>
           <div>
            <p>New Password</p>
            <input type="password" required onChange={(e) => setNewPassword(e.target.value)}/>
           </div>
           <div>
            <p>Confirm New Password</p>
            <input type="password" required onChange={(e) => setConfirmPass(e.target.value)} />
           </div>
           <button>Submit</button>

            </form>

        </div>
    )   
}

export default ResetPassword