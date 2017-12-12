const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  branch_id: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
  course_name: { type: String, require: true, unique: true},
  course_imgUrl: String,
  course_description: String,
  course_like: Number,
  course_skim: Number,
  course_number: Number,
  course_type: { type: String, enum: ['article', 'video', 'audio'], required: true},
  created_time: Date,
});

module.exports = mongoose.model('Course', courseSchema);