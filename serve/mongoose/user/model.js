const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  //wechatName: String,
  openid: {type: String, required: true},
  userName: String,
  avatarUrl: {type: String, default: "/serve/public/uploads/index.jpg"},
  role: { type: String, default: 'user' },
  lastSkim_time: { type: Date, default: Date.now },
  subscriptionList: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Department'}]},
  collectionList: {type: [mongoose.Schema.Types.ObjectId], default: []},
});

module.exports = mongoose.model('User', userSchema);
