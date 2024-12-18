import { useEffect, useState } from 'react';
import './PopUp.css'

const PopUp = ({socket, setFlightData}) => {
    const [popUps, setPopUps] = useState([]);
    
    const closePopUp = (index) => {
        setPopUps(popUps.filter((popUp, i) => i!==index));
    }

    const handleClick = (index, flight) => {
        setFlightData(flight);
        closePopUp(index);
    }

    useEffect(() => {
        if(socket){
            socket.on('notification', (value) => {
                setPopUps(prev => [...prev, value]);
            })

        }
    },[socket])
    
    return(
        <div className="pop-ups">
        {popUps && popUps.map((popUp, i) => 
            <div className="pop-up" key={i}>
                <span onClick={() => closePopUp(i)}>X</span>
                <div onClick={() => handleClick(i, popUp.flight)}>
                <img src="/icons/bell.png" alt="" />
                <p>{popUp.message}</p>
                </div>
            </div>
        )}
        </div>
    )
}

export default PopUp