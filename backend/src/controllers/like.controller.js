import Like from '../models/like.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

class LikeController {
    async likePost(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: "Request body is missing" });
            }

            const { postId } = req.body;
            const userId = req.user._id; // Récupéré depuis le middleware auth

            if (!postId) {
                return res.status(400).json({ msg: 'Missing required fields' });
            }

            const postExists = await Post.findById(postId);
            if (!postExists) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            const existingLike = await Like.findOne({ postId, userId });
            if (existingLike) {
                return res.status(400).json({ msg: 'User already liked this post' });
            }

            const newLike = new Like({
                postId,
                userId
            });

            await newLike.save();

            await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

            return res.status(201).json({ msg: 'Post liked successfully', like: newLike });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }

    async unlikePost(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: "Request body is missing" });
            }

            const { postId } = req.body;
            const userId = req.user._id; // Récupéré depuis le middleware auth

            if (!postId) {
                return res.status(400).json({ msg: 'Missing required fields' });
            }

            const deletedLike = await Like.findOneAndDelete({ postId, userId });

            if (!deletedLike) {
                return res.status(404).json({ msg: 'Like not found or user did not like this post' });
            }

            await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

            return res.status(200).json({ msg: 'Post unliked successfully' });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }

    async getLikesByPostId(req, res) {
        try {
            const likes = await Like.find({ postId: req.params.postId })
                .populate('userId', 'username profilePicture')
            return res.status(200).json(likes);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }

    async getLikedPostsByUser(req, res) {
        try {
            // Récupérer l'utilisateur connecté depuis le middleware auth
            const userId = req.user._id;

            // Trouver tous les likes de cet utilisateur
            const likes = await Like.find({ userId })
                .populate({
                    path: 'postId',
                    populate: {
                        path: 'userId',
                        select: 'username profilePicture'
                    }
                })
                .sort({ createdAt: -1 });

            // Filtrer les likes dont le post n'existe plus (null)
            const validLikes = likes.filter(like => like.postId !== null);

            // Extraire les posts des likes
            const posts = validLikes.map(like => like.postId);

            return res.status(200).json({ posts });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
}

export default new LikeController();
