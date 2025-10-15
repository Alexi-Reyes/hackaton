import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', UserController.getUsers);

userRouter.get('/:id', UserController.getUserById);

userRouter.post('/', UserController.createUser);

userRouter.put('/:id', (req, res) => {
    res.send(`Update user with ID: ${req.params.id}`);
});

userRouter.delete('/:id', (req, res) => {
    res.send(`Delete user with ID: ${req.params.id}`);
});

export default userRouter;
