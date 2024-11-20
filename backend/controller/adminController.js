import Admin from '../model/Admin.js'
import { errorHandler } from '../utils/errorHandler.js';
import crypto from 'crypto';
import generateRandomPassword from '../utils/generateRandomPassword.js';

export const addAdmin = async (req, res) => {
    const { email } = req.body;
    try {
        const existingAdmin = await Admin.findOne({email});
        if (existingAdmin) {
           throw new Error('Email already exists');
        }
        const randomPassword = generateRandomPassword();
        const randomEmployeeId = `${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
        const newAdmin = new Admin({...req.body, employeeId: randomEmployeeId, password: randomPassword});
        newAdmin.save();
        res.status(201).json({ employeeId: newAdmin.employeeId, password: randomPassword});
    } catch (error) {
        const errors = errorHandler(error);
        res.status(400).json({errors});
    }
};

export const get_admins = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const searchTerm = req.query.searchTerm;
    try{
        const searchCriteria = searchTerm
    ? {
        $or: [
            { employeeId: { $regex: new RegExp(searchTerm, 'i') } },
            { fisrtname: { $regex: new RegExp(searchTerm, 'i') } },
            { lastname: { $regex: new RegExp(searchTerm, 'i') } },
            { email: { $regex: new RegExp(searchTerm, 'i') } },
        ]
    }
    : {};
        const admins = await Admin.find(searchCriteria)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalFlights = await Admin.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalFlights / limit);
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            admins
        });
    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const delete_admin = async (req, res) => {
    try{
        const admin= await Admin.findByIdAndDelete(req.params.id);
        if(!admin){
            throw new Error('Admin not found')
        }
        res.status(200).json({message: 'Admin successfully deleted', admin});

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}