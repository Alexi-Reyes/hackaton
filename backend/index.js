// Import Express
import express from 'express';
const app = express();

// Define a route
app.get('/hello', (req, res) => {
    res.send('Hello World');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});