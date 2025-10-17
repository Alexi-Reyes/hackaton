import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

class CommentController {
    async createComment(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: "Request body is missing" });
            }

            const { postId, userId, content } = req.body;

            if (!postId || !userId || !content) {
                return res.status(400).json({ msg: 'Missing required fields' });
            }

            const postExists = await Post.findById(postId);
            if (!postExists) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({ msg: 'User not found' });
            }

            const newComment = new Comment({
                postId,
                userId,
                content
            });

            await newComment.save();

            await Post.findByIdAndUpdate(postId, { $inc: { comments_count: 1 } });

            return res.status(201).json({ msg: 'Comment created successfully', comment: newComment });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
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
            return res.status(500).send('Server error');
        }
    }

    async getCommentById(req, res) {
        try {
            const comment = await Comment.findById(req.params.id)
                .populate('userId', 'username profilePicture');
            if (!comment) {
                return res.status(404).json({ msg: 'Comment not found' });
            }
            return res.status(200).json(comment);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Invalid comment ID' });
            }
            return res.status(500).send('Server error');
        }
    }

    async updateComment(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: "Request body is missing" });
            }

            const { content } = req.body;
            const updatedComment = await Comment.findByIdAndUpdate(
                req.params.id,
                { content },
                { new: true, runValidators: true }
            );

            if (!updatedComment) {
                return res.status(404).json({ msg: 'Comment not found' });
            }

            return res.status(200).json({ msg: 'Comment updated successfully', comment: updatedComment });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Invalid comment ID' });
            }
            return res.status(500).send('Server error');
        }
    }

    async deleteComment(req, res) {
        try {
            const deletedComment = await Comment.findByIdAndDelete(req.params.id);

            if (!deletedComment) {
                return res.status(404).json({ msg: 'Comment not found' });
            }

            await Post.findByIdAndUpdate(deletedComment.postId, { $inc: { comments_count: -1 } });


            return res.status(200).json({ msg: 'Comment deleted successfully' });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Invalid comment ID' });
            }
            return res.status(500).send('Server error');
        }
    }
}

export default new CommentController();
