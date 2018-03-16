const path = require('path');
const express = require('express');

const mediaAPI = require('./mongoose/admin/media/api');
const groupAPI = require('./mongoose/admin/group/api');
const categoryAPI = require('./mongoose/category/api');
const departmentAPI = require('./mongoose/department/api');
const userAPI = require('./mongoose/user/api');
const discussionAPI = require('./mongoose/discussion/api');
const opinionAPI = require('./mongoose/opinion/api');
const audioAPI = require('./mongoose/audio/api');


const routesConfig = (app) => {

  app.get('/api', (req, res) => {
    res.send('hello from api endpoint');
  });

  mediaAPI(app);
  
  groupAPI(app);

  categoryAPI(app);

  departmentAPI(app);

  userAPI(app);

  discussionAPI(app);

  opinionAPI(app);

  audioAPI(app);

  const publicPath = path.resolve(__dirname, '../public');
  app.use('/public', express.static(publicPath));
  app.use('/serve/public', express.static(publicPath));

  app.get('/admin', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.resolve(__dirname, '../public/admin', 'index.html'), {headers: {'Content-Type':'text/html'}})
  })

  app.get('*', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.resolve(__dirname, '../public/mobile', 'index.html'), {headers: {'Content-Type':'text/html'}})
  })

};

module.exports = routesConfig