import { useEffect, useState } from "react";

const GenerateSeats = () =>{
    const [flight, setFlight] = useState();


    useEffect(() => {
        const fetchFlight = async () => {
            try{
                const response = await fetch('/api/flight/671a406789630596b43787d0');
                if(response.ok){
                    const result = await response.json();
                    setFlight(result)
                }
            }catch(err){
                console.error(err);
            }
        }
        fetchFlight();
    }, [])

    const generateSeatButtons = (classObj) => {
        return (
            <div key={classObj._id} style={{display: "grid", gridTemplateColumns: `repeat(${flight.flight.airplane.columns}, 1fr)`}}>
                {classObj.seats.map(seat => <button key={seat._id} value={seat.seatNumber}>{seat.seatNumber}</button>)}
            </div>
        )
    }
    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
            {flight && flight.flight.classes.map(classObj => generateSeatButtons(classObj))}
        </div>
    );

}

export default GenerateSeats;