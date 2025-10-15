import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Database from './src/db.js';
import userRouter from './src/routes/user.route.js';

dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

Database.connect();


app.use('/users', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
