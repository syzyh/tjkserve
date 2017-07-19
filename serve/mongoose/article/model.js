const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  department_id: mongoose.Schema.ObjectId,
  department: { type: mongoose.Schema.ObjectId, ref: 'department' },
  user_id: mongoose.Schema.ObjectId,
  user: { type: mongoose.Schema.ObjectId, ref: 'user' },
  date: Date,
  title: String,
  content: String,
  favorites: Array,
});

module.exports = mongoose.model('article', articleSchema);