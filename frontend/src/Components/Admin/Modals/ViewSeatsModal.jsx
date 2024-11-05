import { useEffect } from "react"
import GenerateSeats from "../../Seats/GenerateSeats"

const ViewSeatsModal = ({flightData}) => {
    
    return (
        <div className="view-seats">
            <GenerateSeats flightData={flightData}/>
        </div>
    )
}

export default ViewSeatsModal