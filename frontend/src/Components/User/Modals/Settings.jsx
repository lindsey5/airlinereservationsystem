import { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import './Settings.css';
import { handleNegativeAndDecimal } from '../../../utils/handleInput';
import { useContext } from 'react';
import { SettingsContext } from '../../../Context/SettingsContext';
import { updateUser } from '../../../Service/userService';

const Settings = () => {
    const { data } = useFetch('/api/user');
    const [details, setDetails] = useState();
    const [disableAge, setDisableAge] = useState(true)
    const [disableGender, setDisableGender] = useState(true)
    const { setShowSettings } = useContext(SettingsContext);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if(data){
            setDetails(data);
        }
    }, [data])

    useEffect(() => {
        if(JSON.stringify(details) === JSON.stringify(data)){
            setIsValid(false);
        }else{
            setIsValid(true);
        }

    }, [details])


    return (
       <div className="settings">
            <div className='container'>
                <button className='close-btn' onClick={() => setShowSettings(false)}>X</button>
                <h2>Settings</h2>
                <a href="">Change Password</a>
                <div className='details-container'>
                    <div>
                        <p>Email:</p>
                        <input type="text" disabled value={details && details.email}/>
                        <button className='change-btn'>Change</button>
                    </div>
                    <div>
                        <p>Age: </p>
                        <input type="number" 
                            disabled={disableAge} 
                            onKeyPress={handleNegativeAndDecimal} 
                            value={details && details.age}
                            onChange={(e) => setDetails(prev => ({...prev, age: e.target.value}))}
                        />
                        <button className='change-btn' onClick={() => setDisableAge(prev => !prev)}>{disableAge ? 'Change' : 'Hide'}</button>
                    </div>
                    <div>
                        <p>Gender: </p>
                        <select disabled={disableGender} value={details && details.gender} onChange={(e) => setDetails(prev => ({...prev, gender: e.target.value}))}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <button className='change-btn' onClick={() => setDisableGender(prev => !prev)}>{disableGender ? 'Change' : 'Hide'}</button>
                    </div>
                </div>
                <div className='buttons'>
                    <button onClick={() => setDetails(data)}>Reset</button>
                    <button disabled={!isValid} onClick={() => updateUser({gender: details.gender, age: details.age})}>Save</button>
                </div>
            </div>
       </div>
    )


}

export default Settings