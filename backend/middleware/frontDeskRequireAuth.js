import jwt from 'jsonwebtoken'
import FrontDeskAgent from '../model/FrontDeskAgent.js';

export const frontDeskRequireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedToken.id;
            const user = await FrontDeskAgent.findById(decodedToken.id);
            if (user) {
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