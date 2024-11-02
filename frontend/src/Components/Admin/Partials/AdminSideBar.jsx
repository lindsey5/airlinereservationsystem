import './AdminSidebar.css';
import { Link } from 'react-router-dom';

const AdminSideBar = () => {

    return (
        <section className="admin-sidebar">
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
            </ul>
        </section>
    )


}

export default AdminSideBar