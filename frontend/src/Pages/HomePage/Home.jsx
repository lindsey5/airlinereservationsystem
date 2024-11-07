import PopularCity from './PopularCity';
import './Home.css'
import SearchContainer from './SearchContainer';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import './tailwind.css';
import Footer from './Footer';

const Home = () => {
    const navigate = useNavigate();
    const elementsRef = useRef([]);
    const [showDropdown, setShowDropdown] = useState(false);

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
          { threshold: 0.1 }
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
                    <li onClick={() => navigate('/user/signup')}>Signup</li>
                    <li>About</li>
                </ul>
                <button onClick={() => setShowDropdown(!showDropdown)}>
                <img src="/icons/menu.png" alt="" />
                </button>
                <div className={`dropdown ${showDropdown ? 'show' : ''}`}>
                    <li onClick={() => navigate('/user/login')}>Login</li>
                    <li onClick={() => navigate('/user/signup')}>Signup</li>
                    <li>About</li>
                </div>
            </header>
            <section className='home'>
                <SearchContainer />
            </section>
            <PopularCity elementsRef={elementsRef}/>
            <div className="mx-auto px-4  py-[200px] flex justify-center items-center opacity-0" ref={el => elementsRef.current[1] = el}>
                <div>
                    <h2 className="text-3xl font-bold text-center my-8">Why book with TCU airlines?</h2>
                    <div className="flex justify-center flex-wrap">
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
            <div className="bg-white-100 w-full h-2/4 flex items-center opacity-0" ref={el => elementsRef.current[2] = el}>
                <div className="mx-auto px-4 w-full box-border mb-24">
                    <div class="tcu-airlines-details bg-white text-center flex justify-between">
                        <div className='max-w-[50%]'>
                        <h1 className="text-4xl text-[#ff3131] font-bold mb-3">Online Flight Booking Made Easy with TCU Airlines</h1>
                        <p className="text-lg mt-16 mb-6">Looking for cheap flights and airfare deals? TCU Airlines, one of the leading flight booking platforms in Southeast Asia, has PAL, cebu pacific, Air Asia, and Skyjet flight routes to choose from and our inventories never ceased to stop growing. TCU Airlines offers flight tickets from domestic and international airlines</p>
                        </div>
                        <img src="/icons/background.jpg" alt="" className="image h-[380px] w-[45%]"/>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}

export default Home