const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  name: { type: String, unique: true, require: true },
  type: { type: String, enum: ['picture', 'video', 'audio'], required: true},
  medias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media'}]
});

module.exports = mongoose.model('Group', groupSchema)