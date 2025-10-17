import { Router } from 'express';
import PostController from '../controllers/post.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const postRouter = Router();

postRouter.post('/', authMiddleware, PostController.createPost);
postRouter.get('/', PostController.getPosts);
postRouter.get('/:id', PostController.getPostById);
postRouter.patch('/:id', authMiddleware, PostController.updatePost);
postRouter.delete('/:id', PostController.deletePost);

export default postRouter;
