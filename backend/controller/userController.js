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

export const changeUserPassword = async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        
        if (!isMatch) throw new Error('Current password is incorrect');

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