import { useReducer, useState } from "react"
import FlightFirstForm from "./FlightFirstForm"
import '../Forms/AdminForm.css'
import './FlightForm.css'
import FlightClassesPrice from "./FlightPrices"

const flightState = {
    departure: {
        airport: '',
        airport_code: '',
        city: '',
        country: '',
        time: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    },
    arrival: {
        airport: '',
        airport_code: '',
        city: '',
        country: '',
        time: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    },
    gate_number: '',
    captain: '',
    co_pilot: '',
    airplane: { id: '' },
}

const flightReducer = (state, action) => {
    switch(action.type){
        case 'SET_DEPARTURE_TIME':
            return {
                ...state, 
                departure: {
                    ...state.departure, 
                    time: action.payload
                }
            };
        case 'SET_DEPARTURE': 
             return {
                ...state,
                departure: {
                    ...state.departure,
                    airport: action.payload.airport,
                    airport_code: action.payload.airport_code,
                    city: action.payload.city,
                    country: action.payload.country
                }
             }
        case 'SET_ARRIVAL_TIME':
            return {
                ...state, 
                arrival: {
                    ...state.arrival, 
                    time: action.payload
                }
            };
        case 'SET_ARRIVAL': 
            return {
               ...state,
               arrival: {
                   ...state.arrival,
                   airport: action.payload.airport,
                   airport_code: action.payload.airport_code,
                   city: action.payload.city,
                   country: action.payload.country
               }
            }
        case 'SET_GATE_NUMBER':
            return { ...state, gate_number: action.payload }
        case 'SET_CAPTAIN':
            return {...state, captain: action.payload }
        case 'SET_CO_PILOT':
            return {...state, co_pilot: action.payload }
        case 'SET_AIRPLANE':
            return {...state, airplane: {code: action.payload}}
        default: 
            return state
    }
}

const FlightForm = ({close}) => {
    const [state, dispatch] = useReducer(flightReducer, flightState);
    const [showPrices, setShowPrices] = useState(false);

    const createFlight = async () => {
        try{
            const response = await fetch('/api/flight',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(state),
            })
            const result = await response.json();
            if(response.ok){
                window.location.reload()
            }
    
            if(result.errors){
                setError(result.errors[0]);
            }
    
        }catch(err){
            setError('Error adding flight')
        }
    }

    return (
        <div className="admin-form">
            {!showPrices ? 
                <FlightFirstForm state={state} dispatch={dispatch} close={close} handleSubmit={() => setShowPrices(true)} /> : 
                <FlightClassesPrice state/>
            }
            
        </div>
    )
}

export default FlightForm