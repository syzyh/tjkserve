const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const serverConfigs = require('./config/serverConfig');

mongoose.connect(serverConfigs.DBURL, { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = express();

require('./serve/express')(app, serverConfigs);

var server = app.listen(serverConfigs.PORT, (error) => {
  if (error) throw error;
  console.log('Serve running on port: ' + serverConfigs.PORT);
});