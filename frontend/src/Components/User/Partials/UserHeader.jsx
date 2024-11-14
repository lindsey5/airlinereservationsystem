import { useLogout } from '../../../hooks/useLogout'
import './UserHeader.css'

const UserHeader = () => {
    return (
        <header>
            <div>
                <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                <h3>TCU <span>AIRLINES</span></h3>
            </div>
            <div>
            <a href="">Bookings</a>
            <button onClick={useLogout}>Logout</button>
            </div>
        </header>
    )
}

export default UserHeader