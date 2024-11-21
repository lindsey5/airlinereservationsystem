import '../../styles/sidebar.css'
import { Link } from 'react-router-dom';

const FrontDeskSideBar = () => {

    return (
        <section className="sidebar">
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
            </ul>
        </section>
    )


}

export default FrontDeskSideBar