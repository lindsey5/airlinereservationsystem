import { useEffect, useState, useContext, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import SearchForms from "../../Components/Search/SearchForms";
import './UserHome.css'
import { SearchContext } from "../../Context/SearchContext";
import Footer from "../HomePage/Footer";
import { useNavigate } from "react-router-dom";

const UserHome = () => {
    const { data } = useFetch('/api/flight/popular?limit=5');
    const [popularCity, setPopularCity] = useState();
    const [currentCity, setCurrentCity] = useState(0);
    const { state, dispatch} = useContext(SearchContext);
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
          { threshold: 0.2 }
        );
    
        elementsRef.current.forEach((el) => {
            if (el) {
                observer.observe(el);
            }
          });
        return () => observer.disconnect();
      }, []);

    useEffect(() => {
        document.title = "TCU Airlines";
    },[]);

    useEffect(() => {
       const getImages = async () => {
            setPopularCity(await Promise.all(data.map(async (item) => {
                try{
                    const response = await fetch(`https://pixabay.com/api/?key=46701607-d51d8d8ab7e9bf8a22e03cd3c&q=${item._id} city&image_type=photo`);
                    if(response.ok){
                        const result = await response.json();
                        return {city: item._id, image: result.hits[1].largeImageURL, country: item.country}
                    }
                }catch(err){
                    console.log(err);
                }
            })))
       }
       if(data){
        getImages();
       }

    }, [data])

    useEffect(() => {
          const intervalId = setInterval(() => {
            setCurrentCity((prev) => (prev === popularCity.length - 1 ? 0 : prev + 1));
    
          }, 5000);
    
          return () => clearInterval(intervalId); 
      }, [popularCity?.length]);
    
    

    const handleFlightType = (value) => {
        dispatch({type: 'SET_FLIGHT_TYPE', flightType: value})
        dispatch({type: 'SET_COUNT', count: value !== 'Multi City' ? 1 : 2})
    };

    return (
        <div className="user-home">
            {popularCity && 
                <div className="city-container">
                    {popularCity.map((city, i) => 
                         <img className='city' src={popularCity[currentCity].image} alt="" style={{display: currentCity == i ? 'block' : 'none'}} />
                    )}
                   
                    <h1>{popularCity[currentCity].city}, {popularCity[currentCity].country}</h1>                
                    <div className="city-buttons">
                    {popularCity.map((city, i) => 
                        <button 
                            onClick={() => setCurrentCity(i)}
                            style={{background: i === currentCity ? '#ff3131' : ''}}
                        ></button>
                    )}
                    </div>
                    <div className="search-form-container">
                        <div className="select-container">
                            <select
                                name="flightType"
                                style={{ marginRight: '20px' }}
                                onChange={(e) => handleFlightType(e.target.value)}
                            >
                                <option value="One Way">One Way</option>
                                <option value="Round Trip">Round Trip</option>
                                <option value="Multi City">Multi City</option>
                            </select>
                            <select
                                name="flightClass"
                                onChange={(e) => dispatch({type: 'SET_FLIGHT_CLASS', flightClass: e.target.value})}
                            >
                                <option value="Economy">Economy</option>
                                <option value="Business">Business</option>
                                <option value="First">First</option>
                            </select>
                        </div>
                        <SearchForms />
                        <div className="buttons-container">
                            {state.flightType === 'Multi City' && (
                                <button
                                    className="add-flight-btn"
                                    onClick={() => dispatch({ type: 'ADD_COUNT'})}
                                >
                                    + Add another flight
                                </button>
                            )}
                            <button 
                                className={`search-btn ${state.isValid ? 'isValid' : ''}`} 
                                onClick={() => navigate('/user/search-results')}
                                disabled={state.isValid ? false : true} 
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            }
             <div className="px-4  py-[200px] flex justify-center items-center opacity-0" ref={el => elementsRef.current[0] = el}>
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
            <div className="bg-white w-full flex items-center opacity-0" ref={el => elementsRef.current[1] = el}>
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
        </div>
    )


}

export default UserHome