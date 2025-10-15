import { Router } from 'express';
import LikeController from '../controllers/like.controller.js';

const likeRouter = Router();

likeRouter.post('/', LikeController.likePost);
likeRouter.delete('/', LikeController.unlikePost);
likeRouter.get('/post/:postId', LikeController.getLikesByPostId);

export default likeRouter;
