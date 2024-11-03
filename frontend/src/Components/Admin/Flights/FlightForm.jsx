import { useReducer, useState } from "react"
import FlightFirstForm from "./FlightFirstForm"
import FlightSecondForm from "./FlightSecondForm";

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
    airline: 'PAL',
    gate_number: '',
    pilot: { id: '' },
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
        case 'SET_AIRLINE': 
             return { ...state, airline: action.payload }
        case 'SET_GATE_NUMBER':
            return { ...state, gate_number: action.payload }
        case 'SET_PILOT':
            return {...state, pilot: action.payload }
        case 'SET_AIRPLANE':
            return {...state, airplane: action.payload}
    }
}

const FlightForm = ({close}) => {
    const [state, dispatch] = useReducer(flightReducer, flightState);
    const [showFirstForm, setShowFirstForm] = useState(true);
    const [showSecondForm, setShowSecondForm] = useState(false);

    const goToSecondForm = () => {
        setShowSecondForm(true);
        setShowFirstForm(false);
    }

    return (
        <div className="admin-form">
            {showFirstForm && <FlightFirstForm state={state} dispatch={dispatch} close={close}/>}
            {showSecondForm && <FlightSecondForm state={state} dispatch={dispatch}/>}
        </div>
    )
}

export default FlightForm