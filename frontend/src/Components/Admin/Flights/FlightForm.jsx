import { useReducer, useState } from "react"
import FlightFirstForm from "./FlightFirstForm"

const flightState = {
    departure: {
        airport: '',
        airport_code: '',
        city: '',
        country: '',
        time: new Date()
    },
    arrival: {
        airport: '',
        airport_code: '',
        city: '',
        country: '',
        time: new Date()
    },
    airline: 'PAL',
    gate_number: ''
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
    }
}

const FlightForm = ({close}) => {
    const [state, dispatch] = useReducer(flightReducer, flightState);
    const [showFirstForm, setShowFirstForm] = useState(true);
    return (
        <div className="admin-form">
            {showFirstForm && <FlightFirstForm state={state} dispatch={dispatch} next={() => setShowFirstForm(false)} close={close}/>}
        </div>
    )
}

export default FlightForm