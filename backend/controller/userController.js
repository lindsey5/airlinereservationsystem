import User from "../model/user.js";
import { errorHandler } from "../utils/errorHandler.js"
import bcrypt from 'bcrypt'

export const getUser = async (req, res) => {
    const id = req.userId;

    try{
        const user = await User.findById(id);
        const { password, ...userDetails } = user.toJSON();
        // Return user details excluding the password
        res.status(200).json(userDetails);
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const update_user = async (req, res) => {
    try{
        const { age, gender } = req.body;
        if(!age || !gender) throw new Error('Fill out the required fields: age, gender')
        const user = await User.findByIdAndUpdate(req.userId, req.body, {
            new: true, 
            runValidators: true,
          })
          if(!user) throw new Error('User not found');

          res.status(200).json({message: 'User successfully updated', user});
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const update_user_email = async (req, res) => {
    try{
        const { newEmail, password } = req.body;
        const isEmailExist = await User.findOne({email: newEmail});
        if(isEmailExist) throw new Error('The email is already registered, try another one');

        const user = await User.findById(req.userId);
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) throw new Error('Incorrect Password');
        
        user.email = newEmail;
        await user.save();
        res.status(200).json({message: 'Email successfully changed'});
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const changeUserPassword = async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        
        if (!isMatch) throw new Error('Current password is incorrect password');

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({message: 'Password successfully changed'});
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const resetUserPassword = async (req, res) =>{
    try{    
        const user = await User.findOne({email: req.body.email});
        if(!user) throw new Error('User not Found');

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({message: 'Password successfully changed'});

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}