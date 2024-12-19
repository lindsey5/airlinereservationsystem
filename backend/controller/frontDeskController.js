import { errorHandler } from '../utils/errorHandler.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateRandomPassword from '../utils/generateRandomPassword.js';
import FrontDeskAgent from '../model/FrontDeskAgent.js';
import { sendNewFrontDeskInfo, sendNewPassword, sendVerificationCode } from '../service/emailService.js';

export const front_desk_login = async (req, res) => {
    const { employeeId, password } = req.body;
    try {
      const front_desk= await FrontDeskAgent.findOne({ employeeId });

      if (!front_desk) {
        throw new Error('Employee id not found');
      }
      const isMatch = await bcrypt.compare(password, front_desk.password);
  
      if (!isMatch) {
        throw new Error('Incorrect employee id or password');
      }

      const token = jwt.sign({id: front_desk._id}, process.env.JWT_SECRET,{
        expiresIn: 24 * 60 * 60
      })
      res.cookie('jwt', token, { httpOnly: true, maxAge:  24 * 60 * 60 * 1000 });
      res.status(201).json({ id: front_desk._id})
    } catch (err) {
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
  }

export const add_front_desk_agent = async (req, res) => {
    const { email } = req.body;
    try {
        const existingAgent = await FrontDeskAgent.findOne({email});
        if (existingAgent) {
           throw new Error('Email already exists');
        }
        const randomPassword = generateRandomPassword();
        const randomEmployeeId = `${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
        const newFrontDeskAgent = new FrontDeskAgent({...req.body, employeeId: randomEmployeeId, password: randomPassword, added_by: req.userId});
        await newFrontDeskAgent.save();
        const data = {
            email,
            firstname: newFrontDeskAgent.firstname,
            lastname: newFrontDeskAgent.lastname,
            employeeId: randomEmployeeId,
            password: randomPassword,
        }
        sendNewFrontDeskInfo(data);
        res.status(201).json({success: 'New front desk agent successfully added'});
    } catch (error) {
        const errors = errorHandler(error);
        res.status(400).json({errors});
    }
};

export const get_front_desk_agents = async (req, res) => {
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
        const frontdesks = await FrontDeskAgent.find(searchCriteria)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalFlights = await FrontDeskAgent.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalFlights / limit);
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            frontdesks
        });
    }catch(err){
        console.log(err)
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const delete_front_desk_agent = async (req, res) => {
    try{
        const frontdesk= await FrontDeskAgent.findByIdAndDelete(req.params.id);
        if(!frontdesk){
            throw new Error('Front Desk Agent not found')
        }
        res.status(200).json({message: 'Front Desk Agent successfully deleted', frontdesk});

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const frontdesk_send_verification_code = async (req, res) => {
    try{    
        const user = await FrontDeskAgent.findOne({ email: req.body.email});
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

export const frontdeskResetPassword = async (req, res) => {
    try {
        const front_desk = await FrontDeskAgent.findOne({email: req.body.email});
        if (!front_desk) {
           throw new Error('Email doesn\t exist');
        }
        const randomPassword = generateRandomPassword();
        front_desk.password = randomPassword;
        await front_desk.save();
        const data = {
            ...front_desk.toJSON(),
            password: randomPassword,
        }
        await sendNewPassword(data, 'Front Desk New Password');
        res.status(201).json({success: 'Reset password success'});
    } catch (error) {
        console.log(error)
        const errors = errorHandler(error);
        res.status(400).json({errors});
    }
};