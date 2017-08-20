const path = require('path');
const express = require('express');

const mediaAPI = require('./mongoose/admin/media/api');
const groupAPI = require('./mongoose/admin/group/api');


const routesConfig = (app) => {

  app.get('/api', (req, res) => {
    res.send('hello from api endpoint');
  });

  mediaAPI(app);
  
  groupAPI(app);

  const publicPath = path.resolve(__dirname, '../public');
  app.use('/public', express.static(publicPath));

  const blogPath = path.resolve(__dirname, '../public/blog');
  app.use(express.static(blogPath));

  // app.get('/', (req, res) => {
  //   res.set('Content-Type', 'text/html');
  //   res.sendFile(path.resolve(__dirname, '../public/blog', 'index.html'), {headers: {'Content-Type':'text/html'}})
  // });

  app.get('/admin', (req, res) => {
    console.log('admin');
    res.set('Content-Type', 'text/html');
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'), {headers: {'Content-Type':'text/html'}})
  });

  app.get('/test', (req, res) => {
    console.log('test')
    res.sendFile(path.resolve(__dirname, '../public/uploads/test.mp3'))
  });
};

module.exports = routesConfig