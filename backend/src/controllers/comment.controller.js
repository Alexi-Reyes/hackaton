import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

class CommentController {
    async createComment(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: ERROR_MESSAGES.REQUEST_BODY_MISSING });
            }

            const { postId, userId, content } = req.body;

            if (!postId || !userId || !content) {
                return res.status(400).json({ msg: ERROR_MESSAGES.MISSING_FIELDS });
            }

            const postExists = await Post.findById(postId);
            if (!postExists) {
                return res.status(404).json({ msg: ERROR_MESSAGES.POST_NOT_FOUND });
            }

            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({ msg: ERROR_MESSAGES.USER_NOT_FOUND });
            }

            const newComment = new Comment({
                postId,
                userId,
                content
            });

            await newComment.save();

            const populatedComment = await newComment.populate('userId', 'username profilePicture');

            await Post.findByIdAndUpdate(postId, { $inc: { comments_count: 1 } });

            return res.status(201).json({
                msg: 'Comment created successfully',
                comment: populatedComment
            });

        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }


    async getCommentsByPostId(req, res) {
        try {
            const comments = await Comment.find({ postId: req.params.postId })
                .populate('userId', 'username profilePicture')
                .sort({ createdAt: -1 });
            return res.status(200).json(comments);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }

    async getCommentById(req, res) {
        try {
            const comment = await Comment.findById(req.params.id)
                .populate('userId', 'username profilePicture');
            if (!comment) {
                return res.status(404).json({ msg: ERROR_MESSAGES.COMMENT_NOT_FOUND });
            }
            return res.status(200).json(comment);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: ERROR_MESSAGES.INVALID_COMMENT_ID });
            }
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }

    async updateComment(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: ERROR_MESSAGES.REQUEST_BODY_MISSING });
            }

            const { content } = req.body;
            const updatedComment = await Comment.findByIdAndUpdate(
                req.params.id,
                { content },
                { new: true, runValidators: true }
            );

            if (!updatedComment) {
                return res.status(404).json({ msg: ERROR_MESSAGES.COMMENT_NOT_FOUND });
            }

            return res.status(200).json({ msg: 'Comment updated successfully', comment: updatedComment });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: ERROR_MESSAGES.INVALID_COMMENT_ID });
            }
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }

    async deleteComment(req, res) {
        try {
            const deletedComment = await Comment.findByIdAndDelete(req.params.id);

            if (!deletedComment) {
                return res.status(404).json({ msg: ERROR_MESSAGES.COMMENT_NOT_FOUND });
            }

            await Post.findByIdAndUpdate(deletedComment.postId, { $inc: { comments_count: -1 } });


            return res.status(200).json({ msg: 'Comment deleted successfully' });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: ERROR_MESSAGES.INVALID_COMMENT_ID });
            }
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }
}

export default new CommentController();
