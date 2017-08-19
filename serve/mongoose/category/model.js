const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  category_name: { type: String, require: true, unique: true},
  categore_order: { type: Number, require: true},
  // category_img: String,
});

module.exports = mongoose.model('category', categorySchema);
