import { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch"
import './SeatSelection.css';

const SeatSelection = ({bookings, currentFlightIndex, currentPassenger, handleSelectedSeat}) => {
    const [flight, setFlight] = useState();
    const { data } = useFetch(`/api/flight/${bookings.flights[currentFlightIndex].id}`);
    const [sumOfColumns, setSumOfColumns] = useState();
    const [columns, setColumns] = useState();
    const [letters, setLetters] = useState([]);
    const seatsContainerRef = useRef();
    let index = 0;
    let num = 1;

    useEffect(() => {

        const setData = async () => {
            if(data?.flight){
                try{
                    const response = await fetch(`/api/airplane/${data.flight.airplane.id}`);
                    if(response.ok){
                        const result = await response.json();
                        setFlight({...data.flight, airplane: result})
                        }
                }catch(err){
                }
            }
        }
        setData();
    },[data])

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

    useEffect(() => {
        if(flight){
            const planeColumns = flight.airplane.columns.split('x').map(column => parseInt(column, 10));
            setSumOfColumns(planeColumns.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
            setColumns(planeColumns);
        }   
    }, [flight])

    return (
        <div className="seat-selection-container">
            {flight && sumOfColumns && 
                <div className="seat-selection" ref={seatsContainerRef}>
                    <div className="logo">
                        <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                        <h3>CLOUDPEAK <span>AIRLINES</span></h3>
                    </div>
                    <h2>Passenger #{currentPassenger + 1}</h2>
                    <p>Flight #{currentFlightIndex + 1}</p>
                    <p>Passenger: {bookings.flights[currentFlightIndex].passengers[currentPassenger].firstname} {bookings.flights[currentFlightIndex].passengers[currentPassenger].lastname}</p>
                    <h3>{bookings.flights[currentFlightIndex].destination}</h3>
                    <p>{bookings.fareType} Tier</p>
                    <p>{bookings.class}</p>
                <div className="seats">
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
                            if(position === sumOfColumns){
                                num++;
                            }

                            const isReserved = bookings.flights[currentFlightIndex].passengers.find(passenger => passenger?.seatNumber === seat.seatNumber);

                            return (
                                <>
                                <button 
                                    className='seat'
                                    key={seat._id} 
                                    value={seat.seatNumber}
                                    onClick={async () => {
                                        if (confirm('Click OK to continue')) {
                                            await handleSelectedSeat(seat.seatNumber);
                                            // Scroll to the element smoothly first
                                            setTimeout(() => {
                                                seatsContainerRef.current.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'start',
                                                });
                                              }, 10);
                                        }
                                      }}
                                    disabled={bookings.class !== classObj.className || seat?.passenger || isReserved ? true : false}
                                >
                                <img src={`/icons/${bookings.class !== classObj.className || seat?.passenger || isReserved ? 'close' : classObj.className + '-seat'}.png`}/>
                                </button>
                                {position % columns[index] === 0 && position !== sumOfColumns && 
                                <div style={{textAlign: 'center', padding: '10px'}}>{num}</div>}
                                </>
                            )
                        })
                    )
                }
            </div>
        </div>
        </div>}
        </div>
    )

}

export default SeatSelection