import Pilot from "../model/pilot.js";
import { errorHandler } from "../utils/errorHandler.js"

export const create_pilot = async(req, res) => {
    try{
        const newPilot = await Pilot.create(req.body);
        newPilot.save();
        res.status(200).json(newPilot);

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}


export const get_pilots = async (req, res) => {
    try{
        const pilots = await Pilot.find();
        res.status(200).json(pilots);
    }catch(err){
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
            { new: true }
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