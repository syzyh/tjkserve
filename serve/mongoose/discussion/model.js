/**
 * discussion model
 */
const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema({
  branch_name: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  created_date: { type: Date, default: Date.now },
  modified_date: { type: Date, default: Date.now },
  title: String,
  content: [String],
  discussion_like: Number,
  discussion_skim: Number,
  department_id: { type: mongoose.Schema.ObjectId, ref: 'Department' },
});

module.exports = mongoose.model('Discussion', discussionSchema);
