import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import './SearchContainer.css';
import { searchFlight } from "../../Service/searchService";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const SearchContainer = () => {
    const [count, setCount] = useState(1);
    const { data: departureCountries } = useFetch('/api/departure/countries');
    const { data: arrivalCountries } = useFetch('/api/arrival/countries');
    const [flightType, setFlightType] = useState('One Way');
    const [flights, setFlights] = useState([]);
    const [validation, setValidation] = useState(false);
    const [flightClass, setFlightClass] = useState('Economy'); 

    const toggleShowCountries = (index, route) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight, i) =>
                i === index
                    ? {
                          ...flight,
                          ...(route === 'from'
                              ? { showFromCountries: !flight.showFromCountries, showFromCities: false }
                              : { showToCountries: !flight.showToCountries, showToCities: false }),
                      }
                    : flight
            )
        );
        resetShowCountries(index, route);
    };

    const resetShowCountries = (index, route) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight, i) =>
                i !== index
                    ? {
                          ...flight,
                          ...(route === 'from'
                              ? { showFromCountries: false }
                              : { showToCountries: false }),
                      }
                    : flight
            )
        );
    };

    const toggleShowCities = (index, route) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight, i) =>
                i === index
                    ? {
                          ...flight,
                          ...(route === 'from'
                              ? { showFromCities: !flight.showFromCities, showFromCountries: false }
                              : { showToCities: !flight.showToCities, showToCountries: false }),
                      }
                    : flight
            )
        );
        resetShowCountries(index, route);
    };

    const setCountry = async (index, country, route) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight, i) =>
                i === index
                    ? {
                          ...flight,
                          ...(route === 'from'
                              ? { FromCountry: country}
                              : { ToCountry: country}),
                      }
                    : flight
            )
        );
        await setCities(route, country, index);
    };

    const resetCity = async(route, index) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight, i) =>
                i === index
                    ? {
                          ...flight,
                          ...(route === 'from'
                              ? { FromCity: null }
                              : { ToCity: null }),
                      }
                    : flight
            )
        );
    }

    const setCities = async (route, country, index) => {
        resetCity(route, index);
        try {
            const response = await fetch(`/api/cities/${country}`);
            if (response.ok) {
                const result = await response.json();
                setFlights((prevFlights) =>
                    prevFlights.map((flight, i) =>
                        i === index
                            ? {
                                  ...flight,
                                  ...(route === 'from'
                                      ? { showFromCities: true, FromCities: result, showFromCountries: false }
                                      : { showToCities: true, ToCities: result, showToCountries: false }),
                              }
                            : flight
                    )
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const CountriesContainer = ({ index, route }) => {
        const countries = route === 'from' ? departureCountries : arrivalCountries;
        return (
            <div className="countries-container">
                {countries && countries?.map((country) => (
                    <span
                        onClick={() => {
                            setCountry(index, country.country, route);
                        }}
                        key={country.country}
                    >
                        {country.country}
                    </span>
                ))}
            </div>
        );
    };

    const setCity = (city, route, index) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight, i) =>
                i === index
                    ? {
                          ...flight,
                          ...(route === 'from'
                              ? { FromCity: city, showFromCountries: false }
                              : { ToCity: city , showToCountries: false }),
                      }
                    : flight
            )
        );
    };

    const setDepartureDateAndTime = (date, index) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight, i) =>
                i === index ? { ...flight, DepartureDateTime: date._d } : flight
            )
        );
    };

    const CitiesContainer = ({ cities, route, index }) => {
        return (
            <div className="cities-container">
                {cities?.map((city) => (
                    <span
                        onClick={() => {
                            setCity(city, route, index);
                        }}
                        key={city}
                    >
                        {city}
                    </span>
                ))}
            </div>
        );
    };

    const handleFlightType = (value) => {
        setFlightType(value);
        setCount(value !== 'Multi City' ? 1 : 2);
    };

    useEffect(() => {
        setFlights(
            Array.from({ length: count }, () => ({
                showFromCountries: false,
                showToCountries: false,
                FromCountry: null,
                ToCountry: null,
                showFromCities: false,
                FromCities: null,
                showToCities: false,
                ToCities: null,
                FromCity: null,
                ToCity: null,
                DepartureDateTime: new Date()
            }))
        );
    }, [count]);

    useEffect(() => {
        let flag = true;
        flights.forEach((flight, i) => {
            
            if(i > 0){
                const prevIndexDate = new Date(flights[i-1].DepartureDateTime);
                prevIndexDate.setDate(prevIndexDate.getDate() + 1);

                if(i > 0 && flight.DepartureDateTime <= prevIndexDate){
                    flag = false;
                }
            }


            if(!flight.FromCountry || !flight.ToCountry || !flight.ToCity || !flight.FromCity){
                flag = false;
            }
            console.log(flag)
        });
        setValidation(flag);
        console.log(flights);
    }, [flights]);


    return (
        <div className="container">
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
                    onChange={(e) => setFlightClass(e.target.value)}
                >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                </select>
            </div>
            {flights.map((flight, i) => (
                    <div key={i} className="search-form">
                        <div
                            className="from-container"
                            onClick={() => {
                                if(!flight.showFromCities){
                                    toggleShowCountries(i, 'from')
                                }else if(flight.showFromCities){
                                    toggleShowCities(i, 'from');
                                }
                            }}
                        >
                            <img src="/icons/airplane.png" alt="" />
                            <div>
                                <span>From:</span>
                                <h4>{flight.FromCountry} {flight.FromCity}</h4>
                            </div>
                            {flight.showFromCountries && <CountriesContainer index={i} route={'from'} />}
                            {flight.showFromCities && <CitiesContainer cities={flight.FromCities} route={'from'} index={i} />}
                        </div>
                        <div
                            className="to-container"
                            onClick={() => {
                                if(!flight.showToCities){
                                    toggleShowCountries(i, 'to')
                                }else if(flight.showToCities){
                                    toggleShowCities(i, 'to');
                                }
                            }}
                        >
                            <img src="/icons/airplane.png" alt="" />
                            <div>
                                <span>To:</span>
                                <h4>{flight.ToCountry} {flight.ToCity}</h4>
                            </div>
                            {flight.showToCountries && <CountriesContainer index={i} route={'to'} />}
                            {flight.showToCities && <CitiesContainer cities={flight.ToCities} route={'to'} index={i} />}
                        </div>
                        <div className="depart-container">
                            <div>
                                <span>Departure Date & Time:</span>
                                <Datetime
                                    inputProps={{ style: { width: '90%' } }}
                                    value={flight.DepartureDateTime}
                                    onChange={date => setDepartureDateAndTime(date, i)}
                                />
                            </div>
                        </div>
                        <div>
                        {flightType === 'Multi City' && i > 0 && 
                            <button className='remove-btn' onClick={() => setCount((prevCounter) => prevCounter - 1)}>
                            X
                            </button>}
                        </div>
                    </div>
            ))}
            <div className="buttons-container">
            {flightType === 'Multi City' && (
                <button
                    className="add-flight-btn"
                    onClick={() => setCount((prevCounter) => prevCounter + 1)}
                >
                    + Add another flight
                </button>
            )}
            <button 
                className='search-btn' 
                onClick={() => searchFlight(flights, flightClass, flightType)}
                disabled={validation ? false : true} 
                style={{backgroundColor: validation ? 'red' : ''}}>
                Search
            </button>
            </div>
        </div>
    );
};

export default SearchContainer;
