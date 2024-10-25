import PopularCity from './PopularCity';
import './Home.css';
import SelectContainer from './SelectContainer';

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
                <SelectContainer />
            </section>
            <PopularCity />
        </main>
    )
}

export default Home