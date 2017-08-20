const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const serverConfigs = require('./config/serverConfig');

mongoose.connect(serverConfigs.DBURL, { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next(); 
});

require('./serve/express')(app, serverConfigs);

var server = app.listen(serverConfigs.PORT, (error) => {
  if (error) throw error;
  console.log('Serve running on port: ' + serverConfigs.PORT);
});