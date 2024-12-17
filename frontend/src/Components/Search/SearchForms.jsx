import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../Context/SearchContext";
import { useContext, useEffect } from "react";
import './SearchForm.css'
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { formatDateOnly } from "../../utils/dateUtils";

const SearchForms = () =>{
    const { data: countries } = useFetch('/api/countries');
    const { state, dispatch, setCountryAsync} = useContext(SearchContext);

    const CountriesContainer = ({ index, route }) => {
        return (
            <div className="countries-container">
                {countries && countries?.map((country) => (
                    <span
                        onClick={() => {
                            setCountryAsync({index, country: country.country, route})
                        }}
                        key={country.country}
                    >
                        {country.country}
                    </span>
                ))}
            </div>
        );
    };

    const CitiesContainer = ({ cities, route, index }) => {
        return (
            <div className="cities-container">
                {cities?.map((city) => (
                    <span
                        onClick={() => {
                            dispatch({type: 'SET_CITY', city, route, index})
                        }}
                        key={city}
                    >
                        {city}
                    </span>
                ))}
            </div>
        );
    };

    useEffect(() => {
        dispatch({ type: 'SET_FLIGHTS'});
    }, [state.count]);

    useEffect(() => {
        let flag = true;
        state.flights.forEach((flight, i) => {
            if(i > 0){
                const prevIndexDate =  new Date(state.flights[i - 1].DepartureTime);

                if(flight.FromCountry !== state.flights[i-1].ToCountry ||
                    flight.FromCity !== state.flights[i-1].ToCity || flight.DepartureTime <= prevIndexDate
                 ){
                    flag = false;
                }
            }
            console.log(flight.DepartureTime, state.returnDate)
            if(!flight.FromCountry 
                || !flight.ToCountry || !flight.ToCity || !flight.FromCity || flight.FromCity === flight.ToCity
                || flight.DepartureTime < formatDateOnly(new Date()) || (state.flightType === 'Round Trip' && (new Date(flight.DepartureTime) >= new Date(state.returnDate) || !state.returnDate))
            ){
                flag = false;
            }
        });
        dispatch({type: 'SET_VALIDATION', payload: flag})
    }, [state.flights]);
    return (
        <>
        {state.flights.map((flight, i) => (
            <div key={i} className="search-form">
                <div
                    className="from-container"
                    onClick={() => {
                        if(!flight.showFromCities){
                            dispatch({ type: 'RESET_SHOW_COUNTRIES', index: i, route: 'from'})
                            dispatch({ type: 'TOGGLE_SHOW_COUNTRIES', index: i, route: 'from'})
                        }else if(flight.showFromCities){
                            dispatch({ type: 'TOGGLE_SHOW_CITIES', index: i, route: 'from'})
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
                            dispatch({ type: 'RESET_SHOW_COUNTRIES', index: i, route: 'to'})
                            dispatch({ type: 'TOGGLE_SHOW_COUNTRIES', index: i, route: 'to'})
                        }else if(flight.showToCities){
                            dispatch({ type: 'TOGGLE_SHOW_CITIES', index: i, route: 'to'})
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
                    <img src="/icons/time.png" alt="" />
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                        label={'Departure Date'} 
                        PopperProps={{
                            sx: {
                              '& .MuiPaper-root': {
                                backgroundColor: 'red',
                                border: '1px solid black',
                              }
                            }
                        }}
                        minDate={
                            i > 0 ? dayjs(new Date(new Date(state.flights[i - 1].DepartureTime).setDate(new Date(state.flights[i - 1].DepartureTime).getDate() + 1)))
                            : 
                            dayjs(new Date())
                        }
                        value={dayjs(flight.DepartureTime)}
                        onChange={(newValue) => dispatch({type: 'SET_DEPARTURE_TIME', date: newValue.$d, index: i})}/>
                        </LocalizationProvider>
                        {state.flightType === 'Round Trip' && 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                        label={'Return Date'} 
                        PopperProps={{
                            sx: {
                              '& .MuiPaper-root': {
                                backgroundColor: 'red',
                                border: '1px solid black',
                              }
                            }
                        }}
                        sx={{ marginTop: '16px' }}
                        minDate={dayjs(new Date(new Date(flight.DepartureTime).setDate(new Date(flight.DepartureTime).getDate() + 1)))}
                        onChange={(newValue) => dispatch({type: 'SET_RETURN_DATE', payload: newValue.$d,})}/>
                        </LocalizationProvider>}
                    </div>
                </div>
                <div>
                {state.flightType === 'Multi City' && i > 1 && 
                    <button className='remove-btn' onClick={() => dispatch({ type: 'REDUCE_COUNT'})}>
                    X
                    </button>
                }
                </div>
                </div>
                ))}
            </>
    )
}

export default SearchForms