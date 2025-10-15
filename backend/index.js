// Import Express
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/db.js';

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

app.get('/hello', (req, res) => {
    res.send('Hello World');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});