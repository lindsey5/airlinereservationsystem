import { useLogout } from '../../../hooks/useLogout';
import '../../styles/sidebar.css'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { SideBarContext } from '../../../Context/sideBarContext';

const AdminSideBar = () => {
    const logout = useLogout();
    const { showSideBar } = useContext(SideBarContext);

    return (
        <section className={`sidebar ${showSideBar ? 'show' : ''}`}>
            <ul>
                <Link to={'dashboard'}>
                    <li>
                    <img src="/icons/dashboards.png" alt="" />
                    Dashboard
                    </li>
                </Link>
                <Link to={'airports'}>
                    <li>
                    <img src="/icons/plane.png" alt="" />
                    Airports
                    </li>
                </Link>
                <Link to={'airplanes'}>
                    <li>
                    <img src="/icons/plane.png" alt="" />
                    Airplanes
                    </li>
                </Link>
                <Link to={'flights'}>
                    <li>
                    <img src="/icons/plane.png" alt="" />
                    Flights
                    </li>
                </Link>
                <Link to={'pilots'}>
                    <li>
                    <img src="/icons/hat.png" alt="" />
                    Pilots
                    </li>
                </Link>
                <Link  to={'admins'}>
                    <li>
                    <img src="/icons/user (1).png" alt="" />
                    Admins
                    </li>
                </Link>
                <Link to={'front-desks'}>
                    <li>
                    <img src="/icons/receptionist.png" alt="" />
                    Front Desk Agents
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

export default AdminSideBar