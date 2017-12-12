const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  //wechatName: String,
  userName: String,
  avatarUrl: {type: String, default: "http://localhost:4000/public/uploads/index.jpg"},
  role: { type: String, default: 'user' },
  lastSkim_time: { type: Date, default: Date.now },
  subscriptionList: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Branch'}], default: []},
  collectionList: {type: [mongoose.Schema.Types.ObjectId], default: []},
});

module.exports = mongoose.model('User', userSchema);
