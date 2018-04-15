/**
 * opinion model
 */
const mongoose = require('mongoose');

const opinionSchema = mongoose.Schema({
  discussion_id: { type: mongoose.Schema.ObjectId, ref: 'Discussion' },
  audio_id: { type: mongoose.Schema.ObjectId, ref: 'Audio' },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  date: Date,
  content: String,
  favorites: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  opinion_id: { type: mongoose.Schema.ObjectId, ref: 'Opinion' },
  toward_user: { type: mongoose.Schema.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Opinion', opinionSchema);
