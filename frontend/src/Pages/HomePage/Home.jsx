import PopularCity from './PopularCity';
import './Home.css'
import SearchContainer from './SearchContainer';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import './tailwind.css';

const Home = () => {
    const navigate = useNavigate();
    const elementsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                } else {
                    entry.target.classList.remove('animate');
                }
            });
          },
          { threshold: 0.3 }
        );
    
        elementsRef.current.forEach((el) => {
            if (el) {
                observer.observe(el);
            }
          });
        return () => observer.disconnect();
      }, []);

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
            <PopularCity elementsRef={elementsRef}/>
            <div className="mx-auto px-4 h-screen flex justify-center items-center opacity-0" ref={el => elementsRef.current[0] = el}>
                <div>
                    <h2 className="text-3xl font-bold text-center my-8">Why book with TCU airlines?</h2>
                    <div className="flex justify-center space-x-10">
                    <div className="text-center flex flex-col items-center">
                        <img src="/icons/magnifier.png" alt="Search Icon" className="w-24 h-24 object-contain mx-auto mb-3" />
                        <h3 className="text-xl font-semibold mt-3">Most Extensive Search Results</h3>
                        <p className="text-gray-600 mt-1">
                            Search and compare flights from Cebu Pacific, AirAsia and other airlines with over 100,000+ routes in Asia Pacific.
                        </p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                        <img src="/icons/shield.png" alt="Shield Icon" className="w-24 h-24 object-contain mx-auto mb-3" />
                        <h3 className="text-xl font-semibold mt-3">Secure & Flexible Payment Methods</h3>
                        <p className="text-gray-600 mt-1">
                            No Credit Card, no problem! We accept payments via Debit Card, GCash, Maya, and more.
                        </p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                        <img src="/icons/chat (2).png" alt="Chat Icon" className="w-24 h-24 object-contain mx-auto mb-3" />
                        <h3 className="text-xl font-semibold mt-3">24/7 Customer Service</h3>
                        <p className="text-gray- mt-1">
                            Get help, fast! Our 24/7 customer service ensures you receive the help and support you need - whenever, wherever.
                        </p>
                    </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Home