/**
 * discussion model
 */
const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema({
  branch_name: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  created_date: { type: Date, default: Date.now },
  modified_date: { type: Date, default: Date.now },
  title: String,
  content: [String],
  discussion_like: Number,
  discussion_skim: Number,
});

module.exports = mongoose.model('Discussion', discussionSchema);
