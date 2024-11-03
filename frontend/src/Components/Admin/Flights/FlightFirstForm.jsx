import { useEffect, useState } from "react"
import useFetch from "../../../hooks/useFetch"
import '../Forms/AdminForm.css'
import './FlightForm.css'
import DatePicker from "react-datepicker"

const FlightFirstForm = ({state, dispatch, next, close}) => {
    const { data: airports } = useFetch('/api/airport/airports')
    const [departure, setDeparture] = useState();
    const [arrival, setArrival] = useState();
    const [error, setError] = useState('');

    const validate = (e) => {
        e.preventDefault();
        setError('')
        if(state.departure.airport === state.arrival.airport){
            setError('*Departure and Arrival airport cannot be the same')
        }else if(new Date(state.departure.time) >= new Date(state.arrival.time)){
            setError('*Departure time should not be greater than or equal to Arrival Time')
        }else{
            next();
        }
    }

    useEffect(() => {
        if(airports){
            const payload = {
                airport: airports.airports[0].airport,
                airport_code: airports.airports[0].airport_code,
                city: airports.airports[0].city,
                country: airports.airports[0].country
            }
            dispatch({type: 'SET_DEPARTURE', payload })
            dispatch({type: 'SET_ARRIVAL', payload })
        }
    },[airports])

    useEffect(() => {
        if(departure){
            const departureAirport = airports.airports.find(airport => airport.airport === departure)
            const payload = {
                airport: departureAirport.airport,
                airport_code: departureAirport.airport_code,
                city: departureAirport.city,
                country: departureAirport.country
            }
            dispatch({type: 'SET_DEPARTURE', payload })
        }
    },[departure])

    useEffect(() => {
        if(arrival){
            const arrivalAirport = airports.airports.find(airport => airport.airport === arrival)
            const payload = {
                airport: arrivalAirport.airport,
                airport_code: arrivalAirport.airport_code,
                city: arrivalAirport.city,
                country: arrivalAirport.country
            }
            dispatch({type: 'SET_ARRIVAL', payload })
        }
    },[arrival])

    return(
            <div className="container">
            <span className='close'onClick={close}>X</span>
            <form onSubmit={validate}>
                <div style={{borderBottom: '1px solid rgb(225,225,225)', paddingBottom: '20px', marginBottom: '30px'}}>
                    <h3>Departure</h3>
                    <div style={{display: 'flex', width: '400px', marginBottom: '50px', justifyContent: 'space-between'}}>
                        <div>
                            <p>Airport</p>
                            <select value={state.departure.airport} onChange={(e) => setDeparture(e.target.value)}>
                            {airports && airports.airports.map(airport => 
                                <option key={airport._id} value={airport.airport}>{airport.airport}</option>
                            )}
                        </select>
                        </div>
                        <div>
                            <p>Time</p>
                            <DatePicker 
                                selected={state.departure.time}
                                onChange={(date) => dispatch({type: 'SET_DEPARTURE_TIME', payload: date})}
                                showTimeSelect
                                dateFormat="Pp"
                                minDate={new Date()} 
                            />
                        </div>
                    </div>

                    <h3>Arrival</h3>
                    <div style={{display: 'flex', width: '400px', marginBottom: '20px', justifyContent: 'space-between'}}>
                        <div>
                            <p>Airport</p>
                            <select value={state.arrival.airport} onChange={(e) => setArrival(e.target.value)}>
                            {airports && airports.airports.map(airport => 
                                <option key={airport._id} value={airport.airport}>{airport.airport}</option>
                            )}
                        </select>
                        </div>
                        <div>
                            <p>Time</p>
                            <DatePicker 
                                selected={state.arrival.time}
                                onChange={(date) => dispatch({type: 'SET_ARRIVAL_TIME', payload: date})}
                                showTimeSelect
                                dateFormat="Pp"
                                minDate={new Date()} 
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <p>Airline</p>
                    <select style={{width: '150px'}} onChange={(e) => dispatch({type: 'SET_AIRLINE', payload: e.target.value})}>
                        <option value="PAL">PAL</option>
                        <option value="Cebu Pacific">Cebu Pacific</option>
                        <option value="Air Asia">Air Asia</option>
                        <option value="Skyjet">Skyjet</option>
                    </select>   
                </div>
                <div style={{margin: '30px 0'}}>
                    <p>Gate Number</p>
                    <input 
                        type="text" 
                        placeholder='A1' 
                        onChange={(e) => 
                            dispatch({type: 'SET_GATE_NUMBER', payload: e.target.value})
                        } 
                        required
                        style={{width: '145px', height: '25px', outline: 'none'}}
                    />
                </div>
                <p style={{color: '#ff3131'}}>{error}</p>
                <input type="submit" className="next-btn" value='Next'/>
            </form>
            </div>
    )
}

export default FlightFirstForm