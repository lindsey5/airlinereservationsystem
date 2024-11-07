import Admin from "../model/Admin";

export const addAdmin = async (req, res) => {
    const { employeeId, email } = req.body;

    try {
        // Check if admin with the same employeeId or email already exists
        const existingAdmin = await Admin.findOne({ $or: [{ employeeId }, { email }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Employee ID or Email already exists' });
        }
        const newAdmin = new Admin(...req.body);

        // Save to the database
        newAdmin.save();

        res.status(201).json({ message: 'New admin added successfully!', newAdmin });
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
};