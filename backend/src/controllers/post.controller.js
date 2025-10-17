import Post from '../models/post.model.js';
import User from '../models/user.model.js';

class PostController {
    async createPost(req, res) {
        try {
            const { content } = req.body;

            if (!content || content.trim() === '') {
                return res.status(400).json({ msg: "Le contenu est requis" });
            }

            const newPost = new Post({
                userId: req.user._id,
                content
            });

            await newPost.save();
            return res.status(201).json({ msg: 'Post créé avec succès', post: newPost });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }


    async getPosts(req, res) {
        try {
            const posts = await Post.find().populate('userId', 'username profilePicture');
            return res.status(200).json(posts);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }

    async getPostById(req, res) {
        try {
            const post = await Post.findById(req.params.id).populate('userId', 'username profilePicture');
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }
            return res.status(200).json(post);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Invalid post ID' });
            }
            return res.status(500).send('Server error');
        }
    }

    async updatePost(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: "Request body is missing" });
            }

            const { content } = req.body;
            if (typeof content !== 'string' || content.trim() === '') {
                return res.status(400).json({ msg: "Le contenu est requis" });
            }

            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            if (!req.user || post.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ msg: 'Forbidden: you can only edit your own posts' });
            }

            post.content = content;
            await post.save();

            const updatedPost = await Post.findById(post._id).populate('userId', 'username profilePicture');

            return res.status(200).json({ msg: 'Post updated successfully', post: updatedPost });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Invalid post ID' });
            }
            return res.status(500).send('Server error');
        }
    }


    async deletePost(req, res) {
        try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            if (post.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ msg: 'Vous n\'êtes pas autorisé à supprimer ce post' });
            }

            await Post.findByIdAndDelete(req.params.id);

            return res.status(200).json({ msg: 'Post deleted successfully' });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Invalid post ID' });
            }
            return res.status(500).send('Server error');
        }
    }
}

export default new PostController();
