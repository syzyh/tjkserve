const mongoose = require('mongoose');

const audioSchema = mongoose.Schema({
  department_id: { type: mongoose.Schema.ObjectId, ref: 'Department' },
  type: { type: String, enum: ['video', 'audio'], required: true},
  audio_name: String,
  audio_description: String,
  audio_url: String,
  audio_like: Number,
  audio_skim: Number,
  audio_order: Number,
  audio_imgUrl: String,
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Audio', audioSchema);