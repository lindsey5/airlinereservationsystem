import Airport from "../model/airport.js";
import { errorHandler } from "../utils/errorHandler.js"

export const create_airport = async (req, res) => {
    try{
        const airport = await Airport.create(req.body);
        airport.save();
        res.status(200).json(airport);
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const get_pagination_airports = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const searchTerm = req.query.searchTerm;
    try{
        const searchCriteria = searchTerm
        ? {
            $or: [
                { airport: { $regex: new RegExp(searchTerm, 'i') } },
                { airport_code: { $regex: new RegExp(searchTerm, 'i') } },
                { city: { $regex: new RegExp(searchTerm, 'i') } },
                { country: { $regex: new RegExp(searchTerm, 'i') }}
            ]
        }
        : {};

        const airports = await Airport.find(searchCriteria)
        .sort({airport: 1})
        .skip(skip)
        .limit(limit);

        const totalPilots = await Airport.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalPilots / limit);
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            airports,
        });
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const get_airports = async (req, res) => {
    try{
        const airports = await Airport.find().sort({airport: 1});
        res.status(200).json({airports});
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}


export const delete_airport = async (req, res) => {
    try{
        const airport = await Airplane.findByIdAndDelete(req.params.id);
        if(!airport){
            throw new Error('Airplane not found')
        }
        res.status(200).json({message: 'Airport successfully deleted', airport});

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const update_airport_data = async (req, res) => {
    try{
        const updatedAirport = await Airport.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        );

        if(!updatedAirport){
            throw new Error('Airport not found');
        }

        res.status(200).json({message: 'Airport successfully updated', updatedValues: updatedAirport})

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}