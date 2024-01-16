// models/Secret.js

const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Secret = mongoose.model('Post', secretSchema);

module.exports = Secret;
