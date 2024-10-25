import { useEffect, useState } from "react"
import useFetch from "../../hooks/useFetch"
import './PopularCity.css'

const AvailableFlightsSection = () => {
    const [flights, setFlights] = useState();
    const { data } = useFetch('/api/flight/popular');

    useEffect(() => {
        const setFetchedData = async () => {
            if(data?.length > 0){
                const updatedData = await Promise.all(data.map(async(flight) => {
                    const image = await getImage(flight._id);
                    return {...flight, image};
                }))
                setFlights(updatedData);
            }
        }
        setFetchedData();
    }, [data]);

    const getImage = async (city) => {
        try{
            const response = await fetch(`https://pixabay.com/api/?key=46701607-d51d8d8ab7e9bf8a22e03cd3c&q=${city} city&image_type=photo`);
            if(response.ok){
                const result = await response.json();
                return result.hits[6].largeImageURL;
            }
        }catch(err){
            console.error(err)
        }
    }

    useEffect(() => {

    })

    return(
        <section className='available-flights-parent'>
                <div className='top-div'>
                    <img src="/icons/Circle Logo.png" alt="" />
                    <h1>Popular Cities</h1>
                </div>
                <div className="available-flights-container">
                {flights && flights.map(flight =>
                        <div key={flight._id}>
                            <img src={flight.image} />
                            <div>
                                <span>{flight._id}</span>
                                <button className="book-btn">Book Flight</button>
                            </div>
                        </div>
                    )}
                </div>
        </section>
    )
}

export default AvailableFlightsSection