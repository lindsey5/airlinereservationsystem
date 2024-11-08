import User from "../model/user";

export const userRequireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedToken.id;
            const provider = await User.findById(decodedToken.id);
            if (provider) {
               return next();
            }
            return res.status(401).json({ error: 'No token found' });
       } catch (error) {
            return res.status(401).json({ error: 'No token found' });
       }
    } else {
        // No token found in cookies
        return res.status(401).json({ error: 'No token found' });
    }
}