const mongoose = require('mongoose');

const branchSchema = mongoose.Schema({
  category_id: { type: mongoose.Schema.ObjectId, ref: 'Category' },
  branch_name: String,
  branch_showName: String,
  branch_description: String,
  branch_imgUrl: String,
  branch_urlName: String,
  created_time: Date,
  modified_time: Date,
});

module.exports = mongoose.model('Branch', branchSchema);