import Airplane from "../model/airplane.js";
import { errorHandler } from "../utils/errorHandler.js";

export const create_airplane = async (req,res) => {
    try{
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
