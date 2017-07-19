const path = require('path');
const express = require('express');

const mediaAPI = require('./mongoose/admin/media/api');
const groupAPI = require('./mongoose/admin/group/api');


const routesConfig = (app) => {
  const publicPath = path.resolve(__dirname, '../public');
  app.use(express.static(publicPath));

  app.get('/api', (req, res) => {
    res.send('hello from api endpoint');
  });

  // mediaAPI(app);
  groupAPI(app);

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'))
  });
};

module.exports = routesConfig;