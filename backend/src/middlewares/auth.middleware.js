import User from '../models/user.model.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

const authMiddleware = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED_NO_SESSION });
    }

    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED_USER_NOT_FOUND });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export default authMiddleware;
