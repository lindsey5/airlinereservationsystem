import { useNavigate } from 'react-router-dom';
import './Success.css'

const Success = () => {
    const navigate = useNavigate();

    return (
        <div className="success">
            <div className='container'>
                <img src="/icons/check.png" alt="" />
                <h2>Book Successful</h2>
                <p>Your flight/s has been successfully booked, and the ticket/s has been sent to your email. </p>
                <button onClick={() => navigate('/user/home')}>Continue</button>
            </div>
        </div>
    )

}

export default Success;