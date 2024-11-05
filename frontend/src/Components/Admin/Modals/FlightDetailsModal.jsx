import { useEffect, useState } from "react"
import './FlightModal.css';
import { formatDate } from "../../../utils/formatDate";
import { get_pilot } from "../../../Service/PilotService";
import ViewSeatsModal from "./ViewSeatsModal";

const FlightDetailsModal = ({flightData, close}) => {
    const [captain, setCaptain] = useState();
    const [coPilot, setCoPilot] = useState();
    const [showSeats, setShowSeats] = useState(false);

    const getCaptain =  async () => {
        setCaptain(await get_pilot(flightData.pilot.captain));
    }

    const getCoPilot = async () => {
        setCoPilot(await get_pilot(flightData.pilot.co_pilot));
    }

    useEffect(() => {
        if(flightData){
            getCaptain();
            getCoPilot();
        }
    }, [flightData])


    return (
        <div className="modal-container">
            <div className="modal">
            {showSeats && flightData && <ViewSeatsModal flightData={flightData}/>}
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img src={`/icons/${flightData.airline}.png`} alt="" />
                    <h3 style={{marginRight: '20px'}}>{flightData.airline}</h3>
                    <button className="view-seats-btn" onClick={() => setShowSeats(true)}>View Seats</button>
                </div>
                <p>Plane ID: {flightData.airplane.id}</p>
                <div className="flight-details">
                    <div>
                        <h3>Departure</h3>
                        <p>{flightData.departure.airport} ({flightData.departure.airport_code})</p>
                        <p>{flightData.departure.city}, {flightData.departure.country}</p>
                        <p>{formatDate(flightData.departure.time)}</p>
                    </div>
                    <div>
                        <h3>Arrival</h3>
                        <p>{flightData.arrival.airport} ({flightData.arrival.airport_code})</p>
                        <p>{flightData.arrival.city}, {flightData.arrival.country}</p>
                        <p>{formatDate(flightData.arrival.time)}</p>
                    </div>
                    <div>
                        <h3>Captain</h3>
                        <p>ID: {captain?._id}</p>
                        <p>Fullname: {captain?.firstname} {captain?.lastname}</p>
                        <p>Nationality: {captain?.nationality}</p>
                    </div>
                    <div>
                        <h3>Co-pilot</h3>
                        <p>ID: {coPilot?._id}</p>
                        <p>Fullname: {coPilot?.firstname} {coPilot?.lastname}</p>
                        <p>Nationality: {coPilot?.nationality}</p>
                    </div>
                </div>
                <button className="close-btn" onClick={close}>Close</button>
            </div>
        </div>
    )
}

export default FlightDetailsModal