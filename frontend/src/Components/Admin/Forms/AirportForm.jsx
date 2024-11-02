import { useState, useEffect} from 'react'
import './AdminForm.css'

const AirportForm = ({handleSubmit, data, close, title}) =>{
    const [airportData, setAirportData] = useState({
        airport: '',
        airport_code: '',
        city: '',
        country: '',
    }) 

    useEffect(() => {
        if(data){
            setAirportData(data);
        }
    },[data])

    const handleFocus = (e) => {
        if(!e.target.classList.contains('onFocus')){
            e.target.classList.add('onFocus')
        }
    }

    const handleBlur = (e) => {
       if(!e.target.value){
            e.target.classList.remove('onFocus');
       }
    }

    return(
        <div className='admin-form'>
        <div className='container'>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}> 
            {airportData?.id && <input type="hidden" value={airportData.id} name='id'/>}    
            <div className='input-container'>
                <input
                    className='input'
                    type="text"
                    name="airport"
                    value={airportData.airport}
                    onChange={(e) => setAirportData(prevData => ({...prevData, airport: e.target.value})) }
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder='Airport'
                    style={{width: '100%'}}
                    required
                />
                <span>Airport</span>
            </div>
            <div className='input-container'>
                <input
                    className='input'
                    type="text"
                    name="airport_code"
                    value={airportData.airport_code}
                    onChange={(e) => setAirportData(prevData => ({...prevData, airport_code: e.target.value})) }
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder='Airport Code'
                    style={{width: '100%'}}
                    required
                />
                <span>Airport Code</span>
            </div>
            <div className='input-container'>
                <input
                    className='input'
                    type="text"
                    name="city"
                    value={airportData.city}
                    onChange={(e) => setAirportData(prevData => ({...prevData, city: e.target.value})) }
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder='City / State'
                    style={{width: '100%'}}
                    required
                />
                <span>City / State</span>
            </div>
            <div className='input-container'>
                <input
                    className='input'
                    type="text"
                    name="country"
                    value={airportData.country}
                    onChange={(e) => setAirportData(prevData => ({...prevData, country: e.target.value})) }
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder='Country'
                    style={{width: '100%'}}
                    required
                />
                <span>Country</span>
            </div>
            <div className="buttons">
                <button type='button' className='close-btn' onClick={close}>Close</button>
                <input type="submit" className="submit-btn" />
            </div>
        </form>
        </div>
    </div>
    )
}

export default AirportForm