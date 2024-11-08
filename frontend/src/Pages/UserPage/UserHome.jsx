import { useEffect, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import SearchForms from "../../Components/Search/SearchForms";
import './UserHome.css'
import { SearchContext } from "../../Context/SearchContext";

const UserHome = () => {
    const { data } = useFetch('/api/flight/popular?limit=5');
    const [popularCity, setPopularCity] = useState();
    const [currentCity, setCurrentCity] = useState(0);
    const { state, dispatch} = useContext(SearchContext);

    useEffect(() => {
        document.title = "Home";
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
          // Update currentCity based on the previous value
          setCurrentCity(prev => 
            prev === popularCity.length - 1 ? 0 : prev + 1
          )
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
                    <img className='city' src={popularCity[currentCity].image} alt="" />
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
                            onClick={() => navigate('/user/login')}
                            disabled={state.isValid ? false : true} 
                        >
                            Search
                        </button>
                    </div>
                    </div>

                </div>
            
            }
        </div>
    )


}

export default UserHome