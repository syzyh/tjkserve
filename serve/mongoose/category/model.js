const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  category_name: { type: String, require: true, unique: true},
  category_order: { type: Number, require: true},
});

module.exports = mongoose.model('Category', categorySchema);
