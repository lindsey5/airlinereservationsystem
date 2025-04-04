import { useState, useEffect} from 'react'
import './AdminForm.css'
import useFetch from '../../../hooks/useFetch'
import { handleBlur, handleFocus } from '../../../utils/handleInput'
import AirplaneSecondForm from './AirplaneSecondForm'

const AirplaneForm = ({handleSubmit, data, close, title}) =>{
    const [airplaneData, setAirplaneData] = useState({
        model: '',
        currentLocation: '',
        code: '',
        airline: '',
    }) 
    const [country, setCountry] = useState('');
    const [showCountry, setShowCountry] = useState(false);
    const { data: airports } = useFetch('/api/airport/airports')
    const { data: countries} = useFetch('/api/countries');
    const [showSecondForm, setShowSecondForm] = useState(false);

    useEffect(() => {
        if(data){
            setAirplaneData(data)
        }
    },[data])

    const submit = (e) => {
        e.preventDefault();
        if(!showSecondForm) setShowSecondForm(true)
    }

    return(
        <div className='admin-form'>
        {showSecondForm && <AirplaneSecondForm airplaneData={airplaneData} handleSubmit={handleSubmit} close={() => setShowSecondForm(false)}/>}
        {!showSecondForm && <div className='container'>
        <h2>{title}</h2>
        <form onSubmit={submit}>
            {airplaneData?._id && 
            <>
                <p style={{color: 'rgb(184, 184, 184)', marginBottom: '30px'}}>ID:{airplaneData._id}</p>
            </>}
            <div style={{display: 'flex'}}>
            <div className='input-container' style={{marginRight: '20px'}}>
                <input
                    className='input'
                    type="text"
                    name="model"
                    value={airplaneData.model}
                    onChange={(e) => setAirplaneData(prevData => ({...prevData, model: e.target.value})) }
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder='Model'
                    style={{width: '100%'}}
                    required
                />
                <span>Model</span>
            </div>
            <div className='input-container'>
                <input
                    className='input'
                    type="text"
                    name="code"
                    value={airplaneData.code}
                    onChange={(e) => setAirplaneData(prevData => ({...prevData, code: e.target.value})) }
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder='Code'
                    style={{width: '100%'}}
                    required
                />
                <span>Code</span>
            </div>    
            </div>            
            {airplaneData?.id && 
                    <div className='input-container'>
                        <input
                            className='input'
                            type="text"
                            name="status"
                            value={airplaneData.status}
                            onChange={(e) => {
                                setAirplaneData(prevData => ({...prevData, status: e.target.value}))
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder='Status'
                            style={{width: '100%'}}
                            required
                        />
                        <span>Status</span>
                    </div>
                }
                <div>
                    <p>Current Location</p>
                    <div className="current-location" 
                        onClick={() => {
                            if(!country){
                                setShowCountry(!showCountry)
                            }else{
                                setCountry('')
                            }
                        }}
                    >
                        <span>{airplaneData.currentLocation ? airplaneData.currentLocation : 'Select'}</span>
                        {countries && showCountry && 
                            <div className="dropdown">
                            {countries.map(country => <div onClick={() => setCountry(country.country)}>{country.country}</div>)}
                            </div>
                        }
                        {country && 
                            <div className="dropdown">
                                {airports.airports.filter(airport => airport.country === country)
                                .map(airport =>  <div onClick={() => setAirplaneData(prevData => ({...prevData, currentLocation: airport.airport}))}>{airport.airport}</div>)}
                            </div>
                        }
                        <input type="hidden" name='currentLocation' value={airplaneData.currentLocation} />
                    </div>
                </div>
                <p>Airline</p>
                <select name='airline' value={airplaneData.airline} onChange={(e) => setAirplaneData(prevData => ({...prevData, airline: e.target.value}))}>
                    <option value=""></option>
                    <option value="PAL">PAL</option>
                    <option value="Cebu Pacific">Cebu Pacific</option>
                    <option value="Air Asia">Air Asia</option>
                    <option value="Skyjet">Skyjet</option>
                </select>
            <div className="buttons">
                <button type='button' className='close-btn' onClick={close}>Close</button>
                <button className="submit-btn">Next</button>
            </div>
        </form>
        </div>}
    </div>
    )
}

export default AirplaneForm