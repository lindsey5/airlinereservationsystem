import { useState, useEffect} from 'react'
import './AdminForm.css'

const AirplaneForm = ({handleSubmit, data, close, title}) =>{
    const [airplaneData, setAirplaneData] = useState({
        model: '',
        seatCapacity: '',
        columns: '',
    }) 

    useEffect(() => {
        if(data){
            setAirplaneData(data)
        }
    },[data])

    useEffect(() => {
        console.log(airplaneData)
    },[airplaneData])

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
            {airplaneData?.id && 
            <>
                <p style={{color: 'rgb(184, 184, 184)', marginBottom: '30px'}}>ID:{airplaneData.id}</p>
                <input type="hidden" name="id" value={airplaneData.id}/>
            </>}
            <div className='input-container'>
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
                    type="number"
                    name="seat-capacity"
                    value={airplaneData.seatCapacity}
                    onChange={(e) => setAirplaneData(prevData => ({...prevData, seatCapacity: e.target.value})) }
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder='Passenger Seat Capacity'
                    style={{width: '100%'}}
                    required
                />
                <span>Passenger Seat Capacity</span>
            </div>
            <div className='input-container'>
                <input
                    className='input'
                    type="text"
                    name="seats-column"
                    value={airplaneData.columns}
                    onChange={(e) => setAirplaneData(prevData => ({...prevData, columns: e.target.value})) }
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder='Seats Column'
                    style={{width: '100%'}}
                    required
                />
                <span>Seats Column</span>
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
                            required
                        />
                        <span>Status</span>
                    </div>
                }
            <div className="buttons">
                <button type='button' className='close-btn' onClick={close}>Close</button>
                <input type="submit" className="submit-btn" />
            </div>
        </form>
        </div>
    </div>
    )
}

export default AirplaneForm