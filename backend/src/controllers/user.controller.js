import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';

class UserController {
    async createUser(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: "Request body is missing" });
            }

            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ msg: "Missing required fields" });
            }

            if (await User.findOne({ username }) || await User.findOne({ email })) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            let user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            return res.status(201).json({ msg: 'User registered successfully', user: { id: user._id, username: user.username, email: user.email } });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Invalid user ID' });
            }
            return res.status(500).send('Server error');
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find().select('-password');
            return res.status(200).json(users);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
}

export default new UserController();
