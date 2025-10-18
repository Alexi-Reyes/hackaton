import Like from '../models/like.model.js';
import Post from '../models/post.model.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

class LikeController {
    async likePost(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: ERROR_MESSAGES.REQUEST_BODY_MISSING });
            }

            const { postId } = req.body;
            const userId = req.user._id;

            if (!postId) {
                return res.status(400).json({ msg: ERROR_MESSAGES.MISSING_FIELDS });
            }

            const postExists = await Post.findById(postId);
            if (!postExists) {
                return res.status(404).json({ msg: ERROR_MESSAGES.POST_NOT_FOUND });
            }

            const existingLike = await Like.findOne({ postId, userId });
            if (existingLike) {
                return res.status(400).json({ msg: ERROR_MESSAGES.USER_ALREADY_LIKED_POST });
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
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }

    async unlikePost(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: ERROR_MESSAGES.REQUEST_BODY_MISSING });
            }

            const { postId } = req.body;
            const userId = req.user._id;

            if (!postId) {
                return res.status(400).json({ msg: ERROR_MESSAGES.MISSING_FIELDS });
            }

            const deletedLike = await Like.findOneAndDelete({ postId, userId });

            if (!deletedLike) {
                return res.status(404).json({ msg: ERROR_MESSAGES.LIKE_NOT_FOUND });
            }

            await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

            return res.status(200).json({ msg: 'Post unliked successfully' });
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }

    async getLikesByPostId(req, res) {
        try {
            const likes = await Like.find({ postId: req.params.postId })
                .populate('userId', 'username profilePicture')
            return res.status(200).json(likes);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }

    async getLikedPostsByUser(req, res) {
        try {
            const userId = req.user._id;

            const likes = await Like.find({ userId })
                .populate({
                    path: 'postId',
                    populate: {
                        path: 'userId',
                        select: 'username profilePicture'
                    }
                })
                .sort({ createdAt: -1 });

            const validLikes = likes.filter(like => like.postId !== null);

            const posts = validLikes.map(like => like.postId);

            return res.status(200).json({ posts });
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
        }
    }
}

export default new LikeController();
