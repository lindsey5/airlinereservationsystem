import { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch"
import './SeatSelection.css';

const SeatSelection = ({bookings, currentFlightIndex, currentPassenger, handleSelectedSeat}) => {
    const [flight, setFlight] = useState();
    const { data } = useFetch(`/api/flight/${bookings.flights[currentFlightIndex].id}`);
    const seatsContainerRef = useRef();
    let index = 1;
    let num = 1;

    useEffect(() => {

        const setData = async () => {
            if(data?.flight){
                try{
                    const response = await fetch(`/api/airplane/${data.flight.airplane.code}`);
                    if(response.ok){
                        const result = await response.json();
                        setFlight({...data.flight, airplane: result})
                        setLoading(false)
                    }
                }catch(err){
                }
            }
        }
        setData();
    },[data])

    return (
        <div className="seat-selection-container">
            {flight && 
                <div className="seat-selection" ref={seatsContainerRef}>
                    <div className="logo">
                        <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                        <h3>CLOUDPEAK <span>AIRLINES</span></h3>
                    </div>
                    <h2>Passenger #{currentPassenger + 1}</h2>
                    <p>Flight #{currentFlightIndex + 1}</p>
                    <p>Passenger: {bookings.flights[currentFlightIndex].passengers[currentPassenger].firstname} {bookings.flights[currentFlightIndex].passengers[currentPassenger].lastname}</p>
                    <h3>{bookings.flights[currentFlightIndex].destination}</h3>
                    <p>{flight.departure.city}, {flight.departure.country} ✈ {flight.arrival.city}, {flight.arrival.country}</p>
                    
                    <p>{bookings.fareType} Tier</p>
                    <p>{bookings.class}</p>
                    <div className="seats">
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
                    return(
                        <div className="seats-rows-container" style={{gridTemplateColumns: `repeat(${totalColumns}, 1fr)`, borderTop: '3px solid black'}}>
                        {letters.length > 0 && letters.map(letter => <div className="letter" style={{margin: '10px'}}>{letter}</div>)}
                        {classObj.seats.map((seat) =>{
                            const position = seat.seatNumber.charAt(0).toUpperCase().charCodeAt(0) - 64;
                            if(position % columns[index] === 0 && position !== (totalColumns -1)){
                                index ++;
                            }else{
                                index = 0;
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
                                {position % columns[index] === 0 && position !== (totalColumns - 1) && 
                                <div style={{textAlign: 'center', padding: '10px'}}>{num++}</div>}
                                </>
                            )
                        })}
                        </div>
                    )
                    })}
            </div>
        </div>}
        </div>
    )

}

export default SeatSelection