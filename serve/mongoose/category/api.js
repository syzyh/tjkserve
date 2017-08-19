const { getCategory, deleteCategory, createCategory, orderCategory } = require('./controller');

const categoryAPI = (app) => {
  app.get('/api/category', (req, res) => {
    getCategory().then(
      result => {res.send(result);},
      err => {res.send(err);}
    )
  });

  app.post('/api/category', (req, res) => {
    const { name } = req.body;
    createCategory(name).then(
      result => {res.send(result);},
      err => {res.send(err);}
    )
  });

  app.delete('/api/category', (req, res) => {
    const { id } = req.query;
    deleteCategory(id).then(
      result => {res.send(result)},
      err => {res.send(err)}
    )
  });

  app.put('/api/category', (req, res) => {
    const { id, order, direction } = req.body;
    orderCategory(id, order, direction).then(
      results => {res.send(results);},
      err => {res.send(err)}
    )
  });
}