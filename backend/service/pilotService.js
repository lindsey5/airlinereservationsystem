import Pilot from "../model/pilot.js";

export const updatePilotStatus = async (pilot) => {
    try{
        const foundPilot = await Pilot.findById(pilot);
        if(!foundPilot){
            return null
        }
        foundPilot.status = 'Available';
        await foundPilot.save();
        return foundPilot
    }catch(err){
        return null
    }
}