import User from "../model/user.js";
import bcrypt from 'bcrypt'

export const userLogin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: 'Username not found' });
      }
  
      // Compare the entered password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // If login is successful
      res.json({ success: true, message: 'Login successful' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }