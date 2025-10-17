import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import path from 'path';
import Database from './src/db.js';
import userRouter from './src/routes/user.route.js';
import postRouter from './src/routes/post.route.js';
import commentRouter from './src/routes/comment.route.js';
import likeRouter from './src/routes/like.route.js';

dotenv.config();
const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.set("trust proxy", isProduction ? 1 : 0)
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
        sameSite: isProduction ? "none" : "lax", secure: isProduction, httpOnly: true
    }
}));

Database.connect();

// routes
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);

// Swagger UI setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerFilePath = path.join(__dirname, 'swagger.yaml');
const swaggerDocument = YAML.load(swaggerFilePath);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
