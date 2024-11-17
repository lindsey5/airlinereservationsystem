import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch"
import './SeatSelection.css';

const SeatSelection = ({bookings, currentFlightIndex, currentPassenger, handleSelectedSeat}) => {
    const [flight, setFlight] = useState();
    const { data } = useFetch(`/api/flight/${bookings.flights[currentFlightIndex].id}`);
    const [sumOfColumns, setSumOfColumns] = useState();
    const [columns, setColumns] = useState();
    const [letters, setLetters] = useState([]);
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
                <div className="seat-selection">
                <div className="logo">
                <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                <h3>TCU <span>AIRLINES</span></h3>
                </div>
                <h2>Passenger #{currentPassenger + 1}</h2>
                <p>Name: {bookings.flights[currentFlightIndex].passengers[currentPassenger].name}</p>
                <p>Date of Birth: {bookings.flights[currentFlightIndex].passengers[currentPassenger].dateOfBirth}</p>
                <h3>{bookings.flights[currentFlightIndex].destination}</h3>
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

                            const isExist = bookings.flights[currentFlightIndex].passengers.find(passenger => passenger?.seatNumber === seat.seatNumber);

                            return (
                                <>
                                <button 
                                    className='seat'
                                    key={seat._id} 
                                    value={seat.seatNumber}
                                    onClick={()=> handleSelectedSeat(seat.seatNumber)}
                                    disabled={bookings.class !== classObj.className || seat?.passenger || isExist ? true : false}
                                >
                                <img src={`/icons/${bookings.class !== classObj.className || seat?.passenger || isExist ? 'close' : classObj.className + '-seat'}.png`}/>
                                </button>
                                {position % columns[index] === 0 && position !== sumOfColumns && <div style={{textAlign: 'center'}}>{num++}</div> }
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