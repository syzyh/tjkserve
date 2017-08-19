const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
  category_id: { type: mongoose.Schema.ObjectId, ref: 'category' },
  department_name: String,
  department_imgUrl: String,
});

module.exports = mongoose.model('department', departmentSchema);