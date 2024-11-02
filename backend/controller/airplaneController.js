import Airplane from "../model/airplane.js";
import { errorHandler } from "../utils/errorHandler.js";

const validateColumns = (columns) => {
    const regex = /^(\d+x)+\d+$/;
    return regex.test(columns);
};

export const create_airplane = async (req,res) => {
    try{
        if (!validateColumns(req.body.columns)) {
            throw new Error('Invalid column format. Please use the format "3x3" or "3x3x3".');
        }

        const newAirplane = new Airplane(req.body);
        await newAirplane.save();
        res.status(200).json(newAirplane);
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const get_airplane = async (req, res) => {
    try{
        const id = req.params.id;
        const airplane = await Airplane.findById(id);
        res.status(200).json(airplane);
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const get_airplanes = async (req, res) => {
    try{
        const airplanes = await Airplane.find();
        res.status(200).json(airplanes);
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}


export const delete_airplane = async (req, res) => {
    try{
        const pilot = await Airplane.findByIdAndDelete(req.params.id);
        if(!pilot){
            throw new Error('Airplane not found')
        }
        res.status(200).json({message: 'Pilot successfully deleted', Airplane});

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const update_airplane_data = async (req, res) => {
    try{
        if (!validateColumns(req.body.columns)) {
            throw new Error('Invalid column format. Please use the format "3x3" or "3x3x3".');
        }
        
        const updatedAirplane = await Airplane.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        );

        if(!updatedAirplane){
            throw new Error('Airplane not found');
        }

        res.status(200).json({message: 'Airplane successfully updated', updatedValues: updatedAirplane})

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}
