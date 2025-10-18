import Post from '../models/post.model.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

class PostController {
    async createPost(req, res) {
        try {
            const { content } = req.body;

            if (!content || content.trim() === '') {
                return res.status(400).json({ msg: ERROR_MESSAGES.CONTENT_REQUIRED });
            }

            const newPost = new Post({
                userId: req.user._id,
                content
            });

            await newPost.save();
            return res.status(201).json({ msg: 'Post créé avec succès', post: newPost });
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }


    async getPosts(req, res) {
        try {
            const posts = await Post.find().populate('userId', 'username profilePicture');
            return res.status(200).json(posts);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }

    async getPostById(req, res) {
        try {
            const post = await Post.findById(req.params.id).populate('userId', 'username profilePicture');
            if (!post) {
                return res.status(404).json({ msg: ERROR_MESSAGES.POST_NOT_FOUND });
            }
            return res.status(200).json(post);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: ERROR_MESSAGES.INVALID_POST_ID });
            }
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }

    async updatePost(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: ERROR_MESSAGES.REQUEST_BODY_MISSING });
            }

            const { content } = req.body;
            if (typeof content !== 'string' || content.trim() === '') {
                return res.status(400).json({ msg: ERROR_MESSAGES.CONTENT_REQUIRED });
            }

            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ msg: ERROR_MESSAGES.POST_NOT_FOUND });
            }

            if (!req.user || post.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ msg: ERROR_MESSAGES.FORBIDDEN_EDIT_POST });
            }

            post.content = content;
            await post.save();

            const updatedPost = await Post.findById(post._id).populate('userId', 'username profilePicture');

            return res.status(200).json({ msg: 'Post updated successfully', post: updatedPost });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: ERROR_MESSAGES.INVALID_POST_ID });
            }
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }


    async deletePost(req, res) {
        try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({ msg: ERROR_MESSAGES.POST_NOT_FOUND });
            }

            if (post.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ msg: ERROR_MESSAGES.FORBIDDEN_DELETE_POST });
            }

            await Post.findByIdAndDelete(req.params.id);

            return res.status(200).json({ msg: 'Post deleted successfully' });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: ERROR_MESSAGES.INVALID_POST_ID });
            }
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }
}

export default new PostController();
