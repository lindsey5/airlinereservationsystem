import { useEffect, useState } from "react"
import useFetch from "../../hooks/useFetch"
import './PopularCity.css'

const PopularCity = ({elementsRef}) => {
    const [flights, setFlights] = useState();
    const { data } = useFetch('/api/flight/popular?limit=12');

    useEffect(() => {
        const setFetchedData = async () => {
            if(data?.length > 0){
                const updatedData = await Promise.all(data.map(async(flight) => {
                    const image = await getImage(flight._id, flight.country);
                    return {...flight, image};
                }))
                setFlights(updatedData);
            }
        }
        setFetchedData();
    }, [data]);

    const getImage = async (city, country) => {
        try{
            const response = await fetch(`https://pixabay.com/api/?key=46701607-d51d8d8ab7e9bf8a22e03cd3c&q=${city} city ${country}&image_type=photo`);
            if(response.ok){
                const result = await response.json();
                return result.hits[1].largeImageURL;
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
                {flights && flights.map(flight =>
                        <div key={flight._id}>
                            <img src={flight.image} />
                            <div>
                                <span>{flight._id}, {flight.country}</span>
                                <button className="book-btn">Book Flight</button>
                            </div>
                        </div>
                    )}
                </div>
        </section>
    )
}

export default PopularCity