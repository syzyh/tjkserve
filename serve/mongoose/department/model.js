const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
  category_id: mongoose.Schema.ObjectId,
  category: { type: mongoose.Schema.ObjectId, ref: 'category' },
  department_name: String,
  department_imgUrl: String,
})