import Flight from "../model/flight.js";
import Pilot from "../model/pilot.js";
import { errorHandler } from "../utils/errorHandler.js"
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export const create_pilot = async(req, res) => {
    try{
        const newPilot = await Pilot.create({...req.body, added_by: req.userId});
        res.status(200).json(newPilot);

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const get_pilot = async (req, res) => {
    try{
        const pilot = await Pilot.findById(req.params.id);
        if(!pilot){
            throw new Error('Pilot not found');
        }
        res.status(200).json(pilot);
        
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const get_pilots = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const searchTerm = req.query.searchTerm;
    try{
        const searchCriteria = searchTerm
        ? {
            $or: [
                { _id: ObjectId.isValid(searchTerm) ? new ObjectId(searchTerm) : null },
                { firstname: { $regex: new RegExp(searchTerm, 'i') } },
                { lastname: { $regex: new RegExp(searchTerm, 'i') } },
                { nationality: { $regex: new RegExp(searchTerm, 'i') } },
                {status: { $regex: new RegExp(searchTerm, 'i') }}
            ]
        }
        : {};

        const pilots = await Pilot.find(searchCriteria)
        .skip(skip)
        .limit(limit);

        const totalPilots = await Pilot.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalPilots / limit);
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            pilots: pilots,
        });
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const delete_pilot = async (req, res) => {
    try{
        const pilot = await Pilot.findByIdAndDelete(req.params.id);
        if(!pilot){
            throw new Error('Pilot not found')
        }
        res.status(200).json({message: 'Pilot successfully deleted', pilot});

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const update_pilot_data = async (req, res) => {
    try{
        const updatedPilot = await Pilot.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        );

        if(!updatedPilot){
            throw new Error('Pilot not found');
        }

        res.status(200).json({message: 'Pilot successfully updated', updatedValues: updatedPilot})

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const get_available_pilots = async (req, res) => {
    const departureTime = new Date(req.query.departureTime);
    const departureAirport = req.query.departureAirport;
    try{
        const pilots = await Pilot.find();

        const availablePilots = await Promise.all(pilots.map(async (pilot) => {
            const flight = await Flight.findOne({
                $or: [
                  { 'pilot.captain': pilot._id },
                  { 'pilot.co_pilot': pilot._id }
                ],
                'pilot.status': { $ne: 'Unavailable' }
              }).sort({ 'arrival.time': -1 });                 
            if(flight){
                const flightArrivalTime = new Date(flight.arrival.time)
                const isAvailable = flight.arrival.airport === departureAirport && 
                new Date(flightArrivalTime.setHours(flightArrivalTime.getHours() + 5)) < departureTime;
                return isAvailable ? pilot : null
            }
            return pilot;
        }));
        const filteredPilots = availablePilots.filter(pilot => pilot !== null)
        res.status(200).json(filteredPilots)

    }catch(err){
        console.log(err);
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}