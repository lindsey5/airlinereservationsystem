import '../../styles/sidebar.css'
import { Link } from 'react-router-dom';
import { useLogout } from '../../../hooks/useLogout';
import { useContext } from 'react';
import { SideBarContext } from '../../../Context/SideBarContext';

const FrontDeskSideBar = () => {
    const logout = useLogout();
    const { showSideBar } = useContext(SideBarContext);

    return (
        <section className={`sidebar ${showSideBar ? 'show' : ''}`}>
            <ul>
                <Link to={'flights'}>
                    <li>
                    <img src="/icons/plane.png" alt="" />
                    Flights
                    </li>
                </Link>
                <Link to={'flight/book'}>
                    <li>
                    <img src="/icons/appointment.png" alt="" />
                    Book Flight
                    </li>
                </Link>
                <Link to={'flights/customer'}>
                    <li>
                    <img src="/icons/plane.png" alt="" />
                    Customer Flights
                    </li>
                </Link>
                <Link onClick={logout}>
                    <li>
                    <img src="/icons/logout.png" alt="" />
                    Log out
                    </li>
                </Link>
            </ul>
        </section>
    )


}

export default FrontDeskSideBar