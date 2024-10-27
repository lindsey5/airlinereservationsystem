import PopularCity from './PopularCity';
import './Home.css';
import SearchContainer from './SearchContainer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <main className='home-page'>
            <header>
                <div>
                    <img src="/icons/Circle Logo.png" alt="" />
                    <h2>TCU Airlines</h2>
                </div>
                <ul>
                    <li onClick={() => navigate('/User/Login')}>Login</li>
                    <li>Signup</li>
                    <li>About</li>
                </ul>
            </header>
            <section className='home'>
                <SearchContainer />
            </section>
            <PopularCity />
        </main>
    )
}

export default Home