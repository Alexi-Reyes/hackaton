import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Database from './src/db.js';
import userRouter from './src/routes/user.route.js';
import postRouter from './src/routes/post.route.js';
import commentRouter from './src/routes/comment.route.js';
import likeRouter from './src/routes/like.route.js';

dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

Database.connect();

// routes
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
