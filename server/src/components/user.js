require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI)
// MongoDB Schema and Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String, 
});

const User = mongoose.model('Users', userSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

// POST request to authenticate a user
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email }); // Query the database for the user with the provided email
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Verify if the entered password matches the stored password
    if (password != user.password){
      return res.status(400).json({ success: false, message: 'Invalid password.' });
    }

    // Successful login, send only the user's ID
    res.json({ success: true, userId: user._id });
    
    
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

module.exports = { authenticateUser };
