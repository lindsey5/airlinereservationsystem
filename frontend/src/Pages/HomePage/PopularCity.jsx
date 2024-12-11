import { useEffect, useState } from "react"
import useFetch from "../../hooks/useFetch"
import './PopularCity.css'
import { useNavigate } from "react-router-dom";
import { fetchUserType } from "../../hooks/fetchUserType";

const PopularCity = ({elementsRef}) => {
    const [cities, setCities] = useState();
    const { data } = useFetch('/api/popular-destinations?limit=12');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchData = async () => {
        setUser(await fetchUserType())
      };
      fetchData();
    }, []);

    useEffect(() => {
        const setFetchedData = async () => {
            if(data?.length > 0){
                const updatedData = await Promise.all(data.map(async(destination) => {
                    const image = await getImage(destination.city, destination.country);
                    return {...destination, image};
                }))
                setCities(updatedData);
            }
        }
        setFetchedData();
    }, [data]);

    const getImage = async (city, country) => {
        try{
            const response = await fetch(`https://pixabay.com/api/?key=46701607-d51d8d8ab7e9bf8a22e03cd3c&q=${city} city, ${country}&image_type=photo`);
            if(response.ok){
                const result = await response.json();
                return result.hits[0].largeImageURL;
            }
        }catch(err){
            console.error(err)
        }
    }

    return(
        <section className='available-flights-parent'> 
                <div className='top-div'>
                    <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                    <h1>Popular Cities</h1>
                </div>
                <div className="available-flights-container opacity-0" ref={el => elementsRef.current[0] = el}>
                {cities && cities.map(city =>
                        <div key={city.city}>
                            <img src={city.image} />
                            <div>
                                <span>{city.city}, {city.country}</span>
                                {!user && <button className="book-btn" onClick={() => navigate('/user/login')}>Book Flight</button>}
                            </div>
                        </div>
                    )}
                </div>
        </section>
    )
}

export default PopularCity