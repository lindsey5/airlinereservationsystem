import PopularCity from './PopularCity';
import './Home.css';

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
                <div className='container'>
                    <div className='select-container'>
                        <select name="" id="" style={{marginRight: '20px'}}>
                            <option value="">One Way</option>
                            <option value="">Round Trip</option>
                        </select>
                        <select name="" id="">
                            <option value="">Economy</option>
                            <option value="">Business</option>
                            <option value="">First</option>
                        </select>
                    </div>
                    <div className='search-form'>
                        <div className='from-container'>
                            <img src="/icons/airplane.png" alt="" />
                            <div>
                                <span>From:</span>
                                <h4>Manila</h4>
                            </div>
                        </div>
                        <div className='to-container'>
                            <img src="/icons/airplane.png" alt="" />
                            <div>
                                <span>To:</span>
                                <h4>Bohol</h4>
                            </div>
                        </div>
                        <div className='depart-container'>
                            <div>
                                <span>Depart:</span>
                                <h4>Thu, Oct 31</h4>
                            </div>
                        </div>
                        <div className='search-container'>
                            <img src="/icons/magnifying-glass.png" alt="" />
                        </div>
                    </div>
                </div>
            </section>
            <PopularCity />
        </main>
    )
}

export default Home