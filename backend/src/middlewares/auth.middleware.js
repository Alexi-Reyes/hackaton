import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
    console.log(req.session)
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized: No active session' });
    }

    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(500).json({ message: 'Server error during authentication' });
    }
};

export default authMiddleware;
