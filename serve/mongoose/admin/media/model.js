const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  name: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['picture', 'video', 'audio'], required: true}
})

module.exports = mongoose.model('Media', mediaSchema);