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
                    <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                    <h3>TCU <span>AIRLINES</span></h3>
                </div>
                <ul>
                    <li onClick={() => navigate('/user/login')}>Login</li>
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