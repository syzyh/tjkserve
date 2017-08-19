const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  name: { type: String, unique: true, require: true },
  type: { type: String, enum: ['picture', 'video', 'audio'], required: true},
});

module.exports = mongoose.model('Group', groupSchema)