const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  avatarUrl: String,
  role: { type: String, default: 'user' },
})

module.exports = mongoose.model('user', userSchema);
