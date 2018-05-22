const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const serverConfigs = require('./config/serverConfig');

mongoose.connect(serverConfigs.DBURL, { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = express();

// app.use("*", function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200)
//   } else {
//     next()
//   }
// });

require('./serve/express')(app, serverConfigs);

var server = app.listen(serverConfigs.PORT, (error) => {
  if (error) throw error;
  console.log('Serve running on port: ' + serverConfigs.PORT);
});