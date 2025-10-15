import { Router } from 'express';
import CommentController from '../controllers/comment.controller.js';

const commentRouter = Router();

commentRouter.post('/', CommentController.createComment);
commentRouter.get('/post/:postId', CommentController.getCommentsByPostId);
commentRouter.get('/:id', CommentController.getCommentById);
commentRouter.put('/:id', CommentController.updateComment);
commentRouter.delete('/:id', CommentController.deleteComment);

export default commentRouter;
