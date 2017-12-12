const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
  category_id: { type: mongoose.Schema.ObjectId, ref: 'Category' },
  department_name: String,
  department_imgUrl: String,
  department_urlName: String,
  department_order: { type: Number, require: true},
  department_imgUrl2: String,
});

module.exports = mongoose.model('Department', departmentSchema);