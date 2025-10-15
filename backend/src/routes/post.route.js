import { Router } from 'express';
import PostController from '../controllers/post.controller.js';

const postRouter = Router();

postRouter.post('/', PostController.createPost);
postRouter.get('/', PostController.getPosts);
postRouter.get('/:id', PostController.getPostById);
postRouter.put('/:id', PostController.updatePost);
postRouter.delete('/:id', PostController.deletePost);

export default postRouter;
