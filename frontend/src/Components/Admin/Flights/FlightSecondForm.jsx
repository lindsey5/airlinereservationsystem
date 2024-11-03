import { useEffect, useState } from "react"

const FlightSecondForm = ({state, dispatch}) => {
    useEffect(() => {
        console.log(state);
    }, [state])

    const validate = async(e) => {
        e.preventDefault();
        isPilotAvailable();
    }

    const isPilotAvailable = async () => {
        try{
            const response = await fetch(`/api/pilot/${state.pilot}/available?departureTime=${state.departure.time}&&departureAirport=${state.departure.airport}`)
            const result = await response.json();
            console.log(result)
        
        }catch(err){

        }
    }

    return (
        <div className="container">
            <form onSubmit={validate}>
                <p>Pilot</p>
                <input 
                    type="text" 
                    placeholder='A1' 
                    onChange={(e) => 
                        dispatch({type: 'SET_PILOT', payload: e.target.value})
                    } 
                    required
                    style={{width: '145px', height: '25px', outline: 'none'}}
                />
                <input type="submit" className="next-btn"/>
            </form>        

        </div>
    )
}

export default FlightSecondForm