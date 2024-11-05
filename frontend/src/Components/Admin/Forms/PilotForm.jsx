import { useEffect, useState } from "react"
import './AdminForm.css'
import { handleBlur, handleFocus, handleNegativeAndDecimal } from '../../../utils/handleInput'

const PilotForm = ({handleSubmit, data, close, title}) => {
    const [pilotData, setPilotData] = useState({
        firstname: '',
        lastname: '',
        age: '',
        dateOfBirth: new Date().toISOString().split('T')[0],
        nationality: '',
    })

    useEffect(() => {
        if(data){
            setPilotData(data)
        }
    },[data])

    return (
        <div className='admin-form'>
            <div className='container'>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
            {pilotData?.id && 
            <>
                <p style={{color: 'rgb(184, 184, 184)', marginBottom: '30px'}}>ID:{pilotData.id}</p>
                <input type="hidden" name="id" value={pilotData.id}/>
            </>
            }
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    <div className='input-container'>
                        <input  
                            className='input'
                            type="text"
                            name="firstname"
                            value={pilotData.firstname}
                            onChange={(e) => {
                                setPilotData(prevData => ({...prevData, firstname: e.target.value}))
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder='Firstname'
                            required
                        />
                        <span>Firstname</span>
                    </div>
                    <div className='input-container'>
                        <input
                            className='input'
                            type="text"
                            name="lastname"
                            value={pilotData.lastname}
                            onChange={(e) => {
                                setPilotData(prevData => ({...prevData, lastname: e.target.value}))
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder='Lastname'
                            required
                        />
                        <span>Lastname</span>
                    </div>
                </div>
                <div className='input-container'>
                        <input
                            className='input'
                            type="number"
                            name="age"
                            value={pilotData.age}
                            onChange={(e) => {
                                setPilotData(prevData => ({...prevData, age: e.target.value}))
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            min="1"
                            placeholder='Age'
                            onKeyPress={handleNegativeAndDecimal}
                            required
                        />
                        <span>Age</span>
                </div>
                <div className='input-container'>
                        <input
                            className='input'
                            type="text"
                            name="nationality"
                            value={pilotData.nationality}
                            onChange={(e) => {
                                setPilotData(prevData => ({...prevData, nationality: e.target.value}))
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder='Nationality'
                            required
                        />
                        <span>Nationality</span>
                </div>
                {pilotData?.id && 
                    <div className='input-container'>
                        <input
                            className='input'
                            type="text"
                            name="status"
                            value={pilotData.status}
                            onChange={(e) => {
                                setPilotData(prevData => ({...prevData, status: e.target.value}))
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder='Status'
                            required
                        />
                        <span>Status</span>
                    </div>
                }
                <div className='input-container'>
                    <label htmlFor="dateOfBirth" style={{display: 'block', marginBottom: '10px', color: 'rgb(184, 184, 184)'}}>Date of Birth</label>
                    <input
                        id="dateOfBirth"
                        type="date"
                        name="dateOfBirth"
                        value={pilotData.dateOfBirth}
                        onChange={(e) => {
                            setPilotData(prevData => ({...prevData, dateOfBirth: e.target.value}))
                        }}
                        required
                    />
                </div>
                <div className="buttons">
                    <button className='close-btn' onClick={close}>Close</button>
                    <input type="submit" className="submit-btn" />
                </div>
            </form>
            </div>
        </div>
    )

}

export default PilotForm