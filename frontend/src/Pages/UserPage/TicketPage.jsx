import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import QRCode from "react-qr-code";

const TicketPage = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    const seatNumberToFind = queryParams.get('seat');
    const {data} = useFetch(`/api/flight/${id}`);
    const [passenger, setPassenger] = useState();

    useEffect(() => {
       if(data){
            setPassenger(data.flight.classes.map(classObj => 
                classObj.seats.find(seat => seat.seatNumber === seatNumberToFind)
            ).filter(classObj => classObj)[0].passenger)
       }
    }, [data])

    useEffect(() => {
        console.log(passenger)
    },[passenger])

    return (
        <div>
        <div style={{ height: "500px", width: "500px" }}>
            {passenger && <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={passenger.ticketNumber}
                viewBox={`0 0 256 256`}
            />}
            </div>
        </div>
    )

}

export default TicketPage;