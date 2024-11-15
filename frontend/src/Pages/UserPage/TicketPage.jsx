import { useEffect, useState, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import QRCode from "react-qr-code";
import html2pdf from 'html2pdf.js';
import './TicketPage.css'
import { formatDate } from "../../utils/dateUtils";

const TicketPage = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const base64Encoded = queryParams.get('data');
    const decodedString = atob(base64Encoded);
    const parsedData = JSON.parse(decodedString);
    const id = parsedData.id;
    const seatNumberToFind = parsedData.seat;
    const {data} = useFetch(`/api/flight/${id}`);
    const [passenger, setPassenger] = useState();
    const [flightClass, setFlightClass] = useState();
    const printRef = useRef();

    const handleDownload = () => {
    const element = printRef.current;

    const options = {
        margin: 10,
        filename: `flight-ticket (${passenger[0].passenger.name}).pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };
  
      html2pdf()
        .from(element)
        .set(options)
        .save();
  };

    useEffect(() => {
        if(data){
            setPassenger(data.flight.classes.map(classObj => 
                classObj.seats.find(seat => seat.seatNumber === seatNumberToFind)
        ).filter(passenger => passenger))
        data.flight.classes.forEach(classObj => {
            classObj.seats.find(seat => seat.seatNumber === seatNumberToFind) ? setFlightClass(classObj.className) : ''
            })
        }
     }, [data])

    return (
        <div className="ticket-page">
            <div className="ticket-container" ref={printRef}>
                <div className='ticket'>
                    <div className="ticket-header">
                        <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                        <h3>TCU AIRLINES TICKET</h3>
                    </div>
                    <div className="passenger-ticket-container">
                        <div>
                            <p>Flight:</p>
                            <h4>{data?.flight && data.flight.flightNumber}</h4>
                        </div>
                        <div>
                            <p>Name:</p>
                            <h4>{passenger && passenger[0]?.passenger.name}</h4>
                        </div>
                        <div>
                            <p>Seat:</p>
                            <h4>{passenger && passenger[0]?.seatNumber}</h4>
                        </div>
                        <div>
                            <p>From:</p>
                            <h4>{data?.flight && data.flight.departure.airport}</h4>
                        </div>
                        <div>
                            <p>To:</p>
                            <h4>{data?.flight && data.flight.arrival.airport}</h4>
                        </div>
                    </div>
                        
                    <div className="ticket-footer">
                        <h4>{data?.flight && data?.flight.departure.airport_code}</h4>
                        <img src="/icons/plane (1).png" alt="" />
                        <h4>{data?.flight && data?.flight.arrival.airport_code}</h4>
                        <h4 style={{marginLeft: '40px'}}>Departure:</h4>
                        <h4 style={{marginLeft: '20px'}}>{data?.flight && formatDate(data.flight.departure.time)}</h4>
                    </div>
                </div>
                <div className="boarding-pass">
                    <div className="ticket-header">
                    <h4>{data?.flight && data?.flight.departure.airport_code}</h4>
                        <img src="/icons/plane (1).png" alt="" />
                        <h4>{data?.flight && data?.flight.arrival.airport_code}</h4>
                    </div>
                    <h3>{flightClass} Class</h3>
                    <div className="flight-info">
                        <div>
                            <p>Flight:</p>
                            <h4>{data?.flight && data.flight.flightNumber}</h4>
                        </div>
                        <div>
                            <p>Seat:</p>
                            <h4>{passenger && passenger[0]?.seatNumber}</h4>
                        </div>
                        <div>
                            <p>Gate:</p>
                            <h4>{data?.flight && data.flight.gate_number}</h4>
                        </div>
                    </div>
                    <div className="qr-container">
                    {passenger && 
                        <QRCode
                            style={{ height: "auto", maxWidth: "100px", width: "100px" }}
                            value={passenger[0].passenger.ticketNumber}
                            viewBox={`0 0 256 256`}
                        />}
                    </div>
                    <div>
                    </div>
                </div>
            </div>
            <button onClick={handleDownload}>Download Ticket</button>
        </div>
    )

}

export default TicketPage;