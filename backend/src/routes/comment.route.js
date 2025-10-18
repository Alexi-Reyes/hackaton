import { Router } from 'express';
import CommentController from '../controllers/comment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const commentRouter = Router();

commentRouter.post('/', authMiddleware, CommentController.createComment);
commentRouter.get('/post/:postId', CommentController.getCommentsByPostId);
commentRouter.get('/:id', CommentController.getCommentById);
commentRouter.put('/:id', authMiddleware, CommentController.updateComment);
commentRouter.delete('/:id', authMiddleware, CommentController.deleteComment);

export default commentRouter;
