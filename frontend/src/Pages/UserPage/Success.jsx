import { useNavigate } from 'react-router-dom';
import './Success.css'
import { useContext, useEffect } from 'react';
import { SearchContext } from '../../Context/SearchContext';

const Success = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(SearchContext);
    useEffect(() => {
        sessionStorage.removeItem('state')
        dispatch({type: 'RESET'})
    },[])

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