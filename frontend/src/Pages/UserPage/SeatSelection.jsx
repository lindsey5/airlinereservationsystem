import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch"
import { createPaymentLink } from "../../Service/paymentService";

const SeatSelection = ({bookings, currentFlightIndex, currentPassenger, setCurrentPassenger, setCurrentFlightIndex}) => {
    const [flight, setFlight] = useState();
    const { data } = useFetch(`/api/flight/${bookings.flights[currentFlightIndex].id}`);
    const [sumOfColumns, setSumOfColumns] = useState();
    const [columns, setColumns] = useState();
    let index = 0;

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
        if(flight){
            const planeColumns = flight.airplane.columns.split('x').map(column => parseInt(column, 10));
            setSumOfColumns(planeColumns.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
            setColumns(planeColumns);
        }   
    }, [flight])

    const handleSelectedSeat = async (seatNumber) => {
        if(confirm('Click ok to continue')){
            bookings.flights[currentFlightIndex].passengers[currentPassenger].seatNumber = seatNumber;
            if(currentFlightIndex === bookings.flights.length -1){
                if(bookings.flights[currentFlightIndex].passengers.length - 1 === currentPassenger){
                    const response = await createPaymentLink(bookings);
                    if(response){
                        window.location.href = response.data.attributes.checkout_url;
                    }else{
                        alert('Payment failed')
                    }
                   console.log(bookings.flights)
                }else{
                    setCurrentPassenger(prev => prev + 1);
                }
            }else{
                setCurrentFlightIndex(prev => prev + 1);
            }
        }


    }

    return (
        <div className="seat-selection-container">
            <div className="seat-selection">
            <p>Flight #{currentFlightIndex + 1}</p>
            <h2>Select seat for passenger #{currentPassenger + 1}</h2>
            <p>{bookings.class}</p>
            <div className="seats">
            {flight && sumOfColumns && 
            <div className='seats-rows-container' style={{gridTemplateColumns: columns.length > 1 ? `repeat(${sumOfColumns+ columns.length -1}, 1fr)` : `repeat(${sumOfColumns}, 1fr)`}}>
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
                                {position % columns[index] === 0 && position !== sumOfColumns && <div></div> }
                                </>
                            )
                        })
                    )
                }
            </div>}
        </div>
        </div>
        </div>
    )

}

export default SeatSelection