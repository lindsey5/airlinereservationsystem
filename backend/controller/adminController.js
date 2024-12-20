import Admin from '../model/Admin.js'
import { errorHandler } from '../utils/errorHandler.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateRandomPassword from '../utils/generateRandomPassword.js';
import { sendNewAdminInfo, sendNewPassword, sendVerificationCode } from '../service/emailService.js';

export const adminLogin = async (req, res) => {
    const { employeeId, password } = req.body;
    try {
      const admin = await Admin.findOne({ employeeId });

      if (!admin) {
        throw new Error('Employee id not found');
      }
      const isMatch = await bcrypt.compare(password, admin.password);
  
      if (!isMatch) {
        throw new Error('Incorrect employee id or password');
      }

      const token = jwt.sign({id: admin._id}, process.env.JWT_SECRET,{
        expiresIn: 24 * 60 * 60
      })
      res.cookie('jwt', token, { httpOnly: true, maxAge:  24 * 60 * 60 * 1000 });
      res.status(201).json({ id: admin._id})
    } catch (err) {
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
  }

export const addAdmin = async (req, res) => {
    const { email } = req.body;
    try {
        const existingAdmin = await Admin.findOne({email});
        if (existingAdmin) {
           throw new Error('Email already exists');
        }
        const randomPassword = generateRandomPassword();
        const randomEmployeeId = `${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
        const newAdmin = new Admin({...req.body, employeeId: randomEmployeeId, password: randomPassword, added_by: req.userId});
        await newAdmin.save();
        const data = {
            email,
            firstname: newAdmin.firstname,
            lastname: newAdmin.lastname,
            employeeId: randomEmployeeId,
            password: randomPassword,
        }
        await sendNewAdminInfo(data);
        res.status(201).json({success: 'New admin successfully added'});
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
            { firstname: { $regex: new RegExp(searchTerm, 'i') } },
            { lastname: { $regex: new RegExp(searchTerm, 'i') } },
            { email: { $regex: new RegExp(searchTerm, 'i') } },
        ]
    }
    : {};
    console.log(req.userId)
        // Exclude the current user (using req.userId) from the results
        if (req.userId) {
            searchCriteria._id = { $ne: req.userId };
        }
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
        console.log(err)
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

export const admin_send_verification_code = async (req, res) => {
    try{    
        const user = await Admin.findOne({ email: req.body.email});
        if(!user){
            throw new Error('Email doesn\t exist')
        }
        const verificationCode = await sendVerificationCode(req.body.email)
        res.cookie('verificationCode', verificationCode, {
          maxAge: 60000,
          secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({message: 'Verification code successfully sent'})
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const adminResetPassword = async (req, res) => {
    try {
        const admin = await Admin.findOne({email: req.body.email});
        if (!admin) {
           throw new Error('Email doesn\t exist');
        }
        const randomPassword = generateRandomPassword();
        admin.password = randomPassword;
        await admin.save();
        const data = {
            ...admin.toJSON(),
            password: randomPassword,
        }
        await sendNewPassword(data, 'New Admin Password');
        res.status(201).json({success: 'Reset password success'});
    } catch (error) {
        console.log(error)
        const errors = errorHandler(error);
        res.status(400).json({errors});
    }
};

export const get_admin = async (req,res) => {
    try{
        const admin = await Admin.findById(req.userId);
        if(!admin) throw new Error('Admin not found');
        res.status(200).json(admin);
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}