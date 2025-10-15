import { Router } from 'express';
import { createUser, getUsers, getUserById } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', getUserById);

userRouter.post('/', createUser);

userRouter.put('/:id', (req, res) => {
    res.send(`Update user with ID: ${req.params.id}`);
});

userRouter.delete('/:id', (req, res) => {
    res.send(`Delete user with ID: ${req.params.id}`);
});

export default userRouter;
