import PopularCity from './PopularCity';
import './Home.css';
import SearchContainer from '../../Components/Search/SearchContainer';

const Home = () => {
    return (
        <main className='home-page'>
            <header>
                <div>
                    <img src="/icons/Circle Logo.png" alt="" />
                    <h2>TCU Airlines</h2>
                </div>
                <ul>
                    <li>Login</li>
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