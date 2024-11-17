import { useEffect, useReducer, useState, useRef } from "react";
import './Seats.css'
import { formatPrice } from "../../utils/formatPrice";

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


const GenerateSeats = ({flightData, close}) =>{
    const [flight, setFlight] = useState();
    const [sumOfColumns, setSumOfColumns] = useState();
    const [columns, setColumns] = useState();
    const [showPassenger, setShowPassenger] = useState(false);
    const [state, dispatch] = useReducer(passengerReducer, passengerState)
    const [letters, setLetters] = useState([]);
    const [selectSeats, setSelectSeats] = useState(false);
    const passengers = [];
    let index = 0;
    const passengerRef = useRef();
    let num = 1;


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
                const response = await fetch(`/api/airplane/${flightData.airplane.id}`);
                if(response.ok){
                    const result = await response.json();
                    setFlight({...flightData, airplane: result})
                    }
            }catch(err){
            }
        }
        setData();
    }, [flightData])

    useEffect(() => {
        if(flight){
            const planeColumns = flight.airplane.columns.split('x').map(column => parseInt(column, 10));
            setSumOfColumns(planeColumns.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
            setColumns(planeColumns);
        }   
    }, [flight])

    useEffect(() => {
        if(columns){
            let currentPosition = 65;
            const letters = [];
            columns.forEach((column, i) => {
                for(let i = 0; i < column; i++){
                    letters.push(String.fromCharCode(currentPosition))
                    currentPosition += 1;
                }
                if(i < columns.length -1) letters.push('');
            })

            setLetters(letters)
        }
    }, [columns])

    const handleShowPassenger = (passenger) => {
        const passengerObj = {
            name: passenger.name,
            email: passenger.email,
            flightPrice: passenger.price,
            type: passenger.type,
            flightClass: passenger.flightClass,
            seatNumber: passenger.seatNumber
        }
        dispatch({type: 'SET_PASSENGER', payload: passengerObj})
        setShowPassenger(true);
    }

    const hidePassenger = () => {
        dispatch({type: 'RESET'})
        setShowPassenger(false)
    }

    return (
        <div className="seats">
            <div className="passenger-modal" ref={passengerRef} style={{display: showPassenger ? 'flex' : 'none'}}>
                <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                <h2>Passenger Information</h2>
                <div>
                <p>Name: {state.name}</p>
                <p>Email: {state.email}</p>
                <p>Flight Price: {formatPrice(state.flightPrice)} ({state.type})</p>
                <p>Class: {state.flightClass}</p>
                <p>Seat: {state.seatNumber}</p>
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
            {flight && sumOfColumns && 
            <div className='seats-rows-container' style={{gridTemplateColumns: columns.length > 1 ? `repeat(${sumOfColumns+ columns.length -1}, 1fr)` : `repeat(${sumOfColumns}, 1fr)`}}>
                {letters.length > 0 && letters.map(letter => <div className="letter">{letter}</div>)}
                {
                    flight.classes.map((classObj) => 
                        classObj.seats.map((seat) =>{
                            const position = seat.seatNumber.charAt(0).toUpperCase().charCodeAt(0) - 64;
                            if(position % columns[index] === 0 && position !== sumOfColumns){
                                index ++;
                            }else{
                                index = 0;
                            }

                            return (
                                <>
                                <button 
                                    onClick={() => 
                                        seat.status === 'booked' ? 
                                        handleShowPassenger({
                                            ...seat.passenger, 
                                            flightClass: classObj.className,
                                            seatNumber: seat.seatNumber
                                        }) : ''}
                                    className='seat'
                                    key={seat._id} 
                                    disabled={selectSeats || seat.status === 'booked' ? false : true}
                                    value={seat.seatNumber}
                                >
                                {seat.status === 'booked' && <img className='check' src="/icons/check (3).png" alt="" />}
                                <img src={`/icons/${classObj.className}-seat.png`}/>
                                </button>
                                {position % columns[index] === 0 && position !== sumOfColumns && 
                                <div></div>}
                                </>
                            )
                        })
                    )
                }
            </div>}
        </div>
    );

}

export default GenerateSeats;