import './AdminSidebar.css';
import { Link } from 'react-router-dom';

const AdminSideBar = () => {

    return (
        <section className="admin-sidebar">
            <ul>
                <Link to={'Dashboard'}>
                    <li>
                    <img src="/icons/dashboards.png" alt="" />
                    Dashboard
                    </li>
                </Link>
                <Link>
                    <li>
                    <img src="/icons/plane.png" alt="" />
                    Airplanes
                    </li>
                </Link>
                <Link>
                    <li>
                    <img src="/icons/plane.png" alt="" />
                    Flights
                    </li>
                </Link>
                <Link to={'Pilots'}>
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