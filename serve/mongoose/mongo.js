var config = require('config-lite')(__dirname);
var mongoose = require('mongoose');
mongoose.connect(config.mongodb);

var contentRowSchema = mongoose.Schema({
  rowTitle: { type: String, required: true, unique: true },
  blocks: [{ blockTitle: String, blockImg: String }],

});

var media = mongoose.Schema({
  mediaTitle: String,
  type: String,
  mediaUrl: String
});
