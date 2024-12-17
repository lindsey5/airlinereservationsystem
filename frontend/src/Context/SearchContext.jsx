import { createContext, useEffect, useReducer } from "react";
import { formatDateOnly } from "../utils/dateUtils";

export const SearchContext = createContext();

const SearchState = { 
    flights: [], 
    count: 1, 
    flightType: 'One Way', 
    flightClass: 'Economy',
    price: 0,
    isValid: false,
};

const SearchReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_SHOW_COUNTRIES':
            return { ...state, flights: toggleShowCountries(state, action) };
        case 'TOGGLE_SHOW_CITIES': 
            return { ...state, flights: toggleShowCities(state, action) };
        case 'SET_COUNTRY':
            return {...state, flights: action.flights};
        case 'SET_CITY':
            return {...state, flights: setCity(state, action)};
        case 'RESET_CITY':
            return {...state, flights: resetCity(state, action)}
        case 'SET_FLIGHTS': 
            return { ...state, flights: setFlights(state) };
        case 'ADD_COUNT':
            return { ...state, count: state.count + 1 };
        case 'REDUCE_COUNT':
            return { ...state, count: state.count - 1 };
        case 'SET_COUNT':
            return { ...state, count: action.count}
        case 'RESET_SHOW_COUNTRIES':
            return { ...state, flights: resetShowCountries(state, action)}
        case 'SET_DEPARTURE_TIME':
            return { ...state, flights: setDepartureTime(state, action)}
        case 'SET_FLIGHT_TYPE':
            return {...state, flightType: action.flightType}
        case 'SET_FLIGHT_CLASS':
            return {...state, flightClass: action.flightClass}
        case 'SET_VALIDATION':
            return {...state, isValid: action.payload}
        case 'SET_PRICE':
            return {...state, price: action.price}
        case 'RESET': 
            return SearchState
        default:
            return state;
    }
};

export const SearchContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SearchReducer, JSON.parse(sessionStorage.getItem('state')) || SearchState);

     const setCountryAsync = async (action) => {
        const updatedFlights = await setCountry(state, action);
        dispatch({ type: 'SET_COUNTRY', flights: updatedFlights });
    };

    useEffect(() => {
        sessionStorage.setItem('state', JSON.stringify(state));
    }, [state])
  
    return (
        <SearchContext.Provider value={{ state, dispatch, setCountryAsync }}>
            {children}
        </SearchContext.Provider>
    )
};

const setFlights = (state) => {

    const flights = Array.from({ length: state.count }, (_, i) => ({
          showFromCountries: false,
          showToCountries: false,
          FromCountry: state.flights[i]?.FromCountry || (i > 0 && state.flights[i - 1]?.ToCountry || null),
          ToCountry: state.flights[i]?.ToCountry || null,
          showFromCities: false,
          FromCities: null,
          showToCities: false,
          ToCities: null,
          FromCity: state.flights[i]?.FromCity || (i > 0 && state.flights[i - 1]?.ToCity || null),
          ToCity: state.flights[i]?.ToCity || null,
          DepartureTime: state.flights[i]?.DepartureTime || (i > 0 ? new Date(new Date(state.flights[i - 1].DepartureTime).setDate(new Date(state.flights[i - 1].DepartureTime).getDate() + 1)) : new Date().toISOString().split('T')[0]),
        }));
        console.log(flights)
    return flights;
  };
  

const toggleShowCountries = (state, action) => {
    return state.flights.map((search, i) =>
        i === action.index
            ? {
                  ...search,
                  ...(action.route === 'from'
                      ? { showFromCountries: !search.showFromCountries }
                      : { showToCountries: !search.showToCountries }),
              }
            : search
    );
};

const resetShowCountries = (state, action) => {
    return state.flights.map((flight, i) =>
        i !== action.index
            ? {
                ...flight,
                ...(action.route === 'from'
                    ? { showFromCountries: false }
                    : { showToCountries: false }),
                }
        : flight
    )
};

const toggleShowCities = (state, action) => {
    return state.flights.map((flight, i) =>
        i === action.index
            ? {
                  ...flight,
                  ...(action.route === 'from'
                      ? { showFromCities: !flight.showFromCities, showFromCountries: false }
                      : { showToCities: !flight.showToCities, showToCountries: false }),
              }
            : flight
    )
}

const setCountry = async (state, action) =>{
    const cities = await setCities(action.country);
    const newFlights = state.flights.map((flight, i) =>
        
        i === action.index
            ? {
                ...flight,
                ...(action.route === 'from'
                ? { FromCountry: action.country, FromCities: cities, FromCity: null, showFromCountries: false, showFromCities: true}
                : { ToCountry: action.country, ToCities: cities, ToCity: null, showToCountries: false, showToCities: true}),
              }
            : flight
    )
    if(state.flightType === 'Multi City'){
        if(action.route === 'from' && action.index > 0){
            newFlights[action.index - 1].ToCity = null;
            newFlights[action.index - 1].ToCountry = newFlights[action.index].FromCountry
        }else if(action.route === 'to' && action.index !== newFlights.length -1){
            newFlights[action.index + 1].FromCity = null
            newFlights[action.index + 1].FromCountry = newFlights[action.index].ToCountry;
        }
    }
    
    return newFlights
}

const setCities = async (country) => {
    try {
        const response = await fetch(`/api/cities/${country}`);
        if (response.ok) {
            const result = await response.json();
            return result;
        }

        return null
    } catch (err) {
        console.error(err);
    }
}

const setCity = (state, action) => {
    console.log(action)
    console.log(state.flights)
    const newFlights =  state.flights.map((flight, i) =>
        i === action.index
            ? {
                  ...flight,
                  ...(action.route === 'from'
                      ? { FromCity: action.city }
                      : { ToCity: action.city }),
              }
            : flight
    )

    if(state.flightType === 'Multi City'){
        if(action.route === 'from' && action.index > 0){
            newFlights[action.index - 1].ToCity = newFlights[action.index].FromCity
        }else if(action.index !== newFlights.length -1){
            newFlights[action.index + 1].FromCity = newFlights[action.index].ToCity;
        }
    }
    return newFlights
}

const setDepartureTime = (state, action) => {
    const newFlights =  state.flights.map((flight, i) =>
            i === action.index ? { ...flight, DepartureTime: action.date } : flight
        )

    return newFlights
};