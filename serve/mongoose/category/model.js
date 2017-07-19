const mongoose = require('mongoose');

const categorySchem = mongoose.Schema({
  category_name: String,
  category_img: String,
});

module.exports = mongoose.model('category', categorySchem);
