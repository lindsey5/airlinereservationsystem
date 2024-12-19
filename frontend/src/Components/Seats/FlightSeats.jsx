import { useEffect, useReducer, useState, useRef } from "react";
import './Seats.css'
import './FlightSeats.css'
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/dateUtils";

const passengerState = {
    name: '',
    email: '',
    flightPrice: '',
    type: '',
    flightClass: '',
    seatNumber: '',
    
}

const passengerReducer = (state, action) => {
    switch(action.type){
        case 'SET_PASSENGER':
            return action.payload
        case 'RESET':
            return passengerState
        default: 
            return state
    }
}

function isFiveMinutesAgo(date) {
    const now = new Date(); // current date and time
    const fiveMinutesAgo = new Date(now - 5 * 60 * 1000); // current time minus 5 minutes in milliseconds
  
    // Check if the date is within 5 minutes of the current time
    return date >= fiveMinutesAgo && date <= now;
  }

const FlightSeats = ({flightData, close}) =>{
    const [flight, setFlight] = useState();
    const [showPassenger, setShowPassenger] = useState(false);
    const [state, dispatch] = useReducer(passengerReducer, passengerState)
    const passengerRef = useRef();
    let index = 0;
    let num = 1

    useEffect(() => {
        if (passengerRef.current) {
          passengerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center', 
          });
        }
      }, [showPassenger, state]);



    useEffect(() => {
        const setData = async () => {
            try{
                const response = await fetch(`/api/airplane/${flightData.airplane.code}`);
                if(response.ok){
                    const result = await response.json();
                    setFlight({...flightData, airplane: result})
                    }
            }catch(err){
            }
        }
        setData();
    }, [flightData])

    const handleShowPassenger = (passenger) => {
        const passengerObj = {
            name: passenger.firstname + ' ' + passenger.lastname,
            ...passenger,
        }
        dispatch({type: 'SET_PASSENGER', payload: passengerObj})
        setShowPassenger(true);
    }

    const hidePassenger = () => {
        dispatch({type: 'RESET'})
        setShowPassenger(false)
    }

    return (
        <div className="flight-seats">
            <div className="seats">
                <div className="passenger-modal" ref={passengerRef} style={{display: showPassenger ? 'flex' : 'none'}}>
                    <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                    <h2>Passenger Information</h2>
                    <div>
                        <p>Name: {state.name}</p>
                        <p>Nationality: {state.nationality}</p>
                        <p>Country of Issue: {state.countryOfIssue}</p>
                        <p>Ticket Amount: {formatPrice(state.price)} ({state.type})</p>
                        <hr />
                        <p>Class: {state.flightClass}</p>
                        <p>{state.fareType} Tier</p>
                        <p>Seat: {state.seatNumber}</p>
                        <p>Request: {state.request ? state.request : 'No request'}</p>
                        <p>Book Date: {state.bookDate}</p>
                        <p></p>
                    </div>
                    <button onClick={hidePassenger}>Close</button>
                </div>
                <div className="legends">
                    <div>
                        <span id='first'></span>
                        First  ({formatPrice(flightData.classes.find(classObj => classObj.className === 'First')?.price)})
                    </div>
                    <div>
                        <span id='business'></span>
                        Business ({formatPrice(flightData.classes.find(classObj => classObj.className === 'Business')?.price)})
                    </div>
                    <div>
                        <span id='economy'></span>
                        Economy ({formatPrice(flightData.classes.find(classObj => classObj.className === 'Economy')?.price)})
                    </div>
                </div>
                <button className="close-btn" onClick={close}>Close</button>
                {flight && flight.classes.map(classObj => {
                    const columns = classObj.columns.split('x').map(column => parseInt(column));
                    index = 0;
                    const totalColumns = columns.reduce((total, acc) => total + parseInt(acc), 0) + 1
                    const letters = [];
                    let currentPosition = 65
                    columns.forEach((column, i) => {
                        for(let i = 0; i < column; i++){
                            letters.push(String.fromCharCode(currentPosition))
                            currentPosition += 1;
                        }
                        if(i < columns.length -1) letters.push('');
                    })
                    
                    return (
                    <div className="seats-rows-container" style={{gridTemplateColumns: `repeat(${totalColumns}, 1fr)`, borderTop: '3px solid black'}}>
                    {letters.length > 0 && letters.map(letter => <div className="letter" style={{margin: '10px'}}>{letter}</div>)}
                    {classObj.seats.map(seat => {
                        const position = seat.seatNumber.charAt(0).toUpperCase().charCodeAt(0) - 64;
                        
                        if(position % columns[index] === 0 && position !== (totalColumns -1)){
                            index ++;
                        }else{
                            index = 0;
                        }
                        

                        return (
                            <>
                            <button 
                                onClick={() => 
                                    handleShowPassenger({
                                        ...seat.passenger, 
                                        flightClass: classObj.className,
                                        seatNumber: seat.seatNumber,
                                        bookDate: formatDate(new Date(seat.passenger.createdAt))
                                    })}
                                className='seat'
                                key={seat._id} 
                                disabled={seat.status === 'reserved' ? false : true}
                                value={seat.seatNumber}
                            >
                            {seat.status === 'reserved' && 
                            (isFiveMinutesAgo(new Date(seat.passenger.createdAt)) ? <img className='new' src="/icons/new.png" alt="" /> : <img className='check' src="/icons/check (3).png" alt="" />)}
                            <img src={`/icons/${classObj.className}-seat.png`}/>
                            </button>
                            {position % columns[index] === 0 && position !== (totalColumns -1) && 
                            <div style={{textAlign: 'center', padding: '10px'}}>{num++}</div>}
                            </>
                        )
                    })}
                    </div>)}
                )
                }
            </div>
        </div>
    );

}

export default FlightSeats