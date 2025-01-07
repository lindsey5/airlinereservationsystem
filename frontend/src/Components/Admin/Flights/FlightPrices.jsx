import { useEffect, useState } from "react"
import useFetch from "../../../hooks/useFetch"
import { handleBlur, handleFocus, handleNegative } from "../../../utils/handleInput"

const FlightClassesPrice = ({state, dispatch, createFlight, close}) => {
    const { data } = useFetch(`/api/airplane/${state.airplane.code}`)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(data) dispatch({type: 'SET_CLASSES', payload: data.classes})
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(confirm('Click ok to continue')){
            setLoading(true)
            const response = await createFlight();
            response.errors ? setError(response.errors[0]) : window.location.reload();
            setLoading(false)
        }
    }

    return <div className="container">
            {loading && <div className="loader-container">
                <div className="loader"></div>
            </div>}
            <span className='close'onClick={close}>X</span>
            <form onSubmit={handleSubmit}>
                <h2>Classes Price</h2>
                <p>From: ({state.departure.airport_code}) {state.departure.city}, {state.departure.country}</p>
                <p style={{marginBottom: '35px'}}>To: ({state.arrival.airport_code}) {state.arrival.city}, {state.arrival.country}</p>
                {state.classes && state.classes.map(flightClass => 
                <>
                    <p>{flightClass.className} Class</p>
                    <div className='input-container'>
                        <input 
                            className='input'
                            type="number" 
                            placeholder="Price"
                            min='1'
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            value={flightClass.price || ''}
                            onKeyPress={handleNegative}
                            required
                            style={{width: '250px'}}
                            onChange={(e) => dispatch({type: 'SET_CLASS_PRICE', payload: {price: e.target.value, className: flightClass.className}})}
                        />
                        <span>Price</span>
                    </div>
                </>
                )}
                <p style={{color: '#ff3131'}}>{error}</p>
                <button className="submit-btn">Create Flight</button>
            </form>
            </div>
}

export default FlightClassesPrice