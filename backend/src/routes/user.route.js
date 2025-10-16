import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/login', UserController.loginUser);
userRouter.post('/logout', UserController.logoutUser);
userRouter.get('/profile', authMiddleware, UserController.getUserProfile);
userRouter.get('/status', authMiddleware, UserController.checkUserStatus);

userRouter.get('/', UserController.getUsers);

userRouter.get('/:id', UserController.getUserById);

userRouter.post('/register', UserController.createUser);

userRouter.put('/:id', authMiddleware, (req, res) => {
    res.send(`Update user with ID: ${req.params.id}`);
});

userRouter.delete('/:id', authMiddleware, (req, res) => {
    res.send(`Delete user with ID: ${req.params.id}`);
});

export default userRouter;
