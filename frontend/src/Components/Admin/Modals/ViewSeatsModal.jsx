import GenerateSeats from "../../Seats/GenerateSeats"

const ViewSeatsModal = ({flightData, close}) => {
    
    return (
        <div className="view-seats">
            <GenerateSeats flightData={flightData} close={close}/>
        </div>
    )
}

export default ViewSeatsModal