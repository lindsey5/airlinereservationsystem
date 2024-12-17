import { useEffect, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import QRCode from "react-qr-code";
import html2pdf from 'html2pdf.js';
import './TicketPage.css'
import { formatDate, getTime } from "../../utils/dateUtils";

const TicketPage = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('data');
    const {data} = useFetch(`/api/booking/${id}`)
    const printRef = useRef();

    const handleDownload = () => {
    const element = printRef.current;

    const options = {
        margin: 10,
        filename: `${data._id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1.5 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };
  
      html2pdf()
        .from(element)
        .set(options)
        .save();
  };

    return (
        <div className="ticket-page">
            <div className='ticket-parent-container' ref={printRef}>
            {data && data.flights.map(flight => {
                    return flight.passengers.map(passenger => 
                        <div className="ticket-container">
                            <div className='ticket'>
                                <div className="ticket-header">
                                    <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                                    <h3>CLOUDPEAK AIRLINES TICKET</h3>
                                </div>
                                <p style={{marginLeft: '20px', fontSize: '20px'}}>Booking ref: {data.booking_ref}</p>
                                <p style={{marginLeft: '20px', fontSize: '15px'}}>Plane Code: {flight.airplane}</p>
                                <div className="passenger-ticket-container">
                                    <div>
                                        <p>Flight:</p>
                                        <h4>{flight.flightNumber}</h4>
                                    </div>
                                    <div>
                                        <p>Name:</p>
                                        <h4>{passenger.firstname} {passenger.lastname}</h4>
                                    </div>
                                    <div>
                                        <p>Seat:</p>
                                        <h4>{passenger.seatNumber}</h4>
                                    </div>
                                    <div>
                                        <p>From:</p>
                                        <h4>{flight.departure.airport}</h4>
                                    </div>
                                    <div>
                                        <p>To:</p>
                                        <h4>{flight.arrival.airport}</h4>
                                    </div>
                                    <div>
                                        <p>Departure:</p>
                                        <h4>{formatDate(flight.departure.time)}</h4>
                                        <p>Arrival:</p>
                                        <h4>{formatDate(flight.arrival.time)}</h4>
                                    </div>
                                </div>
                                <div className="ticket-footer">
                                    <h4>{flight.departure.airport_code}</h4>
                                    <img src="/icons/plane (1).png" alt="" />
                                    <h4 style={{marginRight: '20px'}}>{flight.arrival.airport_code}</h4>
                                    <h4>{data.fareType} Tier</h4>
                                </div>
                            </div>
                            <div className="boarding-pass">
                                <div className="ticket-header">
                                <h4>{flight.departure.airport_code}</h4>
                                    <img src="/icons/plane (1).png" alt="" />
                                    <h4>{flight.arrival.airport_code}</h4>
                                </div>
                                <div className="mid-container">
                                <h3>{data.class} Class</h3>
                                <div className="flight-info">
                                    <div>
                                        <p>Flight:</p>
                                        <h4>{flight.flightNumber}</h4>
                                    </div>
                                    <div>
                                        <p>Seat:</p>
                                        <h4>{passenger.seatNumber}</h4>
                                    </div>
                                    <div>
                                        <p>Gate:</p>
                                        <h4>{flight.gate_number}</h4>
                                    </div>
                                </div>
                                <div className="qr-container">
                                    <QRCode
                                        style={{ height: "auto", maxWidth: "100px", width: "100px" }}
                                        value={passenger.ticketNumber}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                                </div>
                                <div style={{padding: '5px', fontWeight: '600', fontSize: '13px'}}>
                                    <p>Boarding Time: {getTime(new Date(flight.departure.time).setMinutes(new Date(flight.departure.time).getMinutes() - 30))} </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            )}
            </div>
            <button onClick={handleDownload}>Download Ticket</button>
        </div>
    )

}

export default TicketPage;