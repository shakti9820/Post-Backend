// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./model/userModel");
const Post =  require("./model/postModel")
const Secret = require('./model/postModel');
const cors = require("cors");
// require('dotenv').config();

const isAuth=require('./middlewere/isAuth')






const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("DB Connection Successful");
    })
    .catch((error) => {
      console.error("DB Connection Error:", error.message);
    });




app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log(email,password);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
      // console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/post', isAuth,async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId; // Extracted from the JWT in middleware

    const newSecret = new Secret({ content, userId });
    await newSecret.save();

    res.status(201).json({ message: 'Secret stored successfully.' });
  } catch (error) {
    console.error('Error storing secret:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/getData',isAuth ,async (req, res, next) => {
  const userId = (req.userId);
  //  console.log(req.userId);
  try {
    const user = await User.findById({_id:userId}).select('-password');
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // console.log(user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'An error occurred' });
    next(ex);
  }
});



// Get all posts excluding current user's posts
app.get('/getpost', isAuth,async (req, res) => {
  try {
    // Fetch all posts except the current user's posts
    const allPosts = await Post.find({ userId: { $ne: req.userId } });
    res.json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/mypost', isAuth, async (req, res) => {
  try {
    const userId = req.userId; // Extract userId from the authenticated request

    // Fetch posts based on userId
    const myPosts = await Post.find({ userId });

    res.status(200).json(myPosts);
  } catch (error) {
    console.error('Error fetching my posts:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
