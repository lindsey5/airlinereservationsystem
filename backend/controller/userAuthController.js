import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/errorHandler.js";
import { sendVerificationCode } from "../service/emailService.js";
import User from '../model/user.js';

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
    
      if (!user) {
        throw new Error('Email not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }
      
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
        expiresIn: 24 * 60 * 60
      })
      res.cookie('jwt', token, { httpOnly: true, maxAge:  24 * 60 * 60 * 1000 });
      res.status(201).json({ user: user._id})
    } catch (err) {
      const errors = errorHandler(err);
      res.status(400).json({errors});
    }
  }

  export const userSignup = async (req, res) => {
    try{
      const isExist = await User.findOne({email: req.body.email});
      if(isExist){
        throw new Error('The email is already registered')
      }
      const newUser = new User(req.body);
      await newUser.save();
      const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET,{
        expiresIn: 24 * 60 * 60
      })
      res.cookie('jwt', token, { httpOnly: true, maxAge:  24 * 60 * 60 * 1000 });

      res.status(201).json({ user: newUser._id})

    }catch(err){
      console.log(err);
      const errors = errorHandler(err);
      res.status(400).json({errors});
    }
  }

export const signupVerificationCode = async (req, res) => {
    try{    
        const user = await User.findOne({ email: req.query.email});

        if(user){
            throw new Error('The email is already registered')
        }
        const verificationCode = await sendVerificationCode(req.query.email)
        res.cookie('verificationCode', verificationCode, {
          maxAge: 60000,
          secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({message: 'Verification code successfully sent'})
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}