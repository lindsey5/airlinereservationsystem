import { useEffect, useState } from "react";
import './Seats.css'
import { formatPrice } from "../../utils/formatPrice";

const GenerateSeats = ({flightData, close}) =>{
    const [flight, setFlight] = useState();
    const [sumOfColumns, setSumOfColumns] = useState();
    const [columns, setColumns] = useState();
    let index = 0;

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

    return (
        <div className="seats">
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
                                    className='seat'
                                    key={seat._id} 
                                    value={seat.seatNumber}
                                >
                                <img src={`/icons/${classObj.className}-seat.png`}/>
                                </button>
                                {position % columns[index] === 0 && position !== sumOfColumns && <div></div> }
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