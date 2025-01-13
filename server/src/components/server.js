const express = require('express');
const cors = require('cors'); // To handle CORS issues if frontend and backend are on different origins
const { authenticateUser } = require('./user'); // Import the authenticateUser function
const {addCar, findAllCars, findCarByID} = require('./car')
const app = express();
const PORT = 5000;
const multer = require('multer');

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Memory storage for simplicity
const upload = multer({ storage }); // Initialize multer for file handling

// Middleware
app.use(express.json());
app.use(cors());

// API Endpoints

app.post('/login', authenticateUser);
app.post('/addCar', upload.array('images', 10), addCar); // Use multer middleware
app.get('/displayAllCars', findAllCars);
app.get('/displayCars', findCarByID);

// Start Server
app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server listening on PORT ${PORT}`);
});
