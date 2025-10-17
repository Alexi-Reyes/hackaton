import { Router } from 'express';
import LikeController from '../controllers/like.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const likeRouter = Router();

likeRouter.post('/', authMiddleware, LikeController.likePost);
likeRouter.delete('/', authMiddleware, LikeController.unlikePost);
likeRouter.get('/post/:postId', LikeController.getLikesByPostId);
likeRouter.get('/user/posts', authMiddleware, LikeController.getLikedPostsByUser);

export default likeRouter;
