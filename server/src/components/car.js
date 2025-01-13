require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Memory storage for simplicity
const upload = multer({ storage }); // Initialize multer for file handling

// MongoDB Schema and Model for Cars
const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  price: { type: Number, required: true },
  phoneNo: { type: String, required: true },
  images: [{ type: Buffer, required: true }], // Array of images (Buffers)
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to Users model
    required: true
  }});

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true }
  });
  
const User = mongoose.model('User', userSchema);
  
const Car = mongoose.model('Car', carSchema);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

// Function to handle adding a car with multiple images
const addCar = async (req, res) => {
  const { model, price, phoneNo, ownerID } = req.body;

  // Check if images are provided
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'At least one image is required.' });
  }

  try {
    // Extract image buffers from uploaded files
    const imageBuffers = req.files.map((file) => file.buffer);

    const car = new Car({
      model,
      price,
      phoneNo,
      images: imageBuffers, // Store the image buffers in the database
      ownerID
    });

    await car.save();
    res.status(200).json({ success: true, car });
  } catch (err) {
    console.error('Error saving car:', err);
    res.status(500).json({ success: false, message: 'Error saving car.', error: err });
  }
};

// Function to handle fetching all cars
const findAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate('ownerID', 'email name').exec();
    res.json({ success: true, cars });
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// Function to handle fetching a car by its ID
const findCarByID = async (req, res) => {
  try {
    const id  = req.query.id;

    if (!id) {
      return res.status(400).json({ error: 'The "id" parameter is required.' });
    }

    // Query the database to search cars owned by user
    const cars = await Car.find({ ownerID: id }).populate('ownerID');
    
    if (!cars || cars.length === 0) {
      return res.status(404).json({ error: `No cars found for user with id: ${id}` });
    }

    res.status(200).json({ cars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addCar, findAllCars, findCarByID };
