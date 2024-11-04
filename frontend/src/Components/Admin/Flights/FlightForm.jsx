import { useReducer, useState } from "react"
import FlightFirstForm from "./FlightFirstForm"
import FlightSecondForm from "./FlightSecondForm";
import '../Forms/AdminForm.css'
import './FlightForm.css'

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
    captain: '',
    co_pilot: '',
    airplane: { id: '' },
    classes : []
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
        case 'SET_CAPTAIN':
            return {...state, captain: action.payload }
        case 'SET_CO_PILOT':
            return {...state, co_pilot: action.payload }
        case 'SET_AIRPLANE':
            return {...state, airplane: {id: action.payload}}
        case 'SET_CLASSES':
            return {...state, classes: action.payload}
        case 'SET_CLASS_PRICE':
            const price = action.payload.price;
            const className = action.payload.className;
            return {
                ...state,
                classes: state.classes.map(classItem => 
                    classItem.className === className 
                        ? { ...classItem, price }
                        : classItem
                )
            };
        case 'SET_CLASS_SEATS':
            const classname = action.payload.className;
            const seats = action.payload.seats;
            return {
                ...state,
                classes: state.classes.map(classItem => 
                    classItem.className === classname 
                        ? { ...classItem, seats }
                        : classItem
                )
            };
        default: 
            return state
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
            {showFirstForm && <FlightFirstForm state={state} dispatch={dispatch} close={close} handleSubmit={goToSecondForm}/>}
            {showSecondForm && <FlightSecondForm state={state} dispatch={dispatch}/>}
        </div>
    )
}

export default FlightForm