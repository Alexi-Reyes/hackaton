import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';

class UserController {
   async createUser(req, res) {
        try {
            const { username, email, password, profilePicture } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ msg: "Missing required fields" });
            }

            if (await User.findOne({ username }) || await User.findOne({ email })) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            let user = new User({
                username,
                email,
                password,
                profilePicture: profilePicture || null
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            return res.status(201).json({
                msg: 'User registered successfully',
                user: { id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture }
            });
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

    async updateUser(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: "Request body is missing" });
            }
            const { username, email } = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { username, email },
                { new: true, runValidators: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ msg: 'User not found' });
            }
            return res.status(200).json({ msg: 'User updated successfully', user: updatedUser });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Invalid user ID' });
            }
            return res.status(500).send('Server error');
        }
    }
                

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ msg: 'Missing required fields' });
            }

            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(400).json({ msg: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Incorrect password' });
            }

            req.session.userId = user._id;
            res.cookie('sessionId', user._id.toString(), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24
            });

            return res.status(200).json({ msg: 'Logged in successfully', user: { id: user._id, username: user.username, email: user.email } });

        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }

    async logoutUser(req, res) {
        try {
            req.session.destroy(err => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Could not log out');
                }
                res.clearCookie('sessionId');
                return res.status(200).json({ msg: 'Logged out successfully' });
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }

    async getUserProfile(req, res) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }

    async checkUserStatus(req, res) {
        try {
            return res.status(200).json({ msg: 'User is logged in' });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
}

export default new UserController();
