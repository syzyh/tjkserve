const articlesData = require('./mock');

const articleAPI = (app) => {
  app.get('/api/article/:article_id', (req, res) => {
    res.send(articlesData);
  });
}