const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const mediaSchema = mongoose.Schema({
  groupId: { type: ObjectId, ref: 'Group', default: ObjectId("withoutid"), required: false },
  url: { type: String, required: true, index: true },
  localUrl: String,
  name: { type: String, required: true, unique: false, index: false },
  type: { type: String, enum: ['picture', 'video', 'audio'], required: true},
  detailType: String,
})

module.exports = mongoose.model('Media', mediaSchema);