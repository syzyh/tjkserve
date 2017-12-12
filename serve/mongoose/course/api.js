const { getCategory, deleteCategory, createCategory, updateCategory, updateCategorys } = require('./controller');

const categoryAPI = (app) => {
  app.get('/api/category', (req, res) => {
    getCategory().then(
      result => {res.send(result);},
      err => {res.send(err);}
    )
  });

  app.post('/api/category', (req, res) => {
    const { name, order,type } = req.body;
    createCategory(name, order).then(
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
    const { id, name, order} = req.body;
    console.log({id, name, order});
    updateCategory(id, name, order).then(
      results => {res.send(results);},
      err => {res.send(err)}
    );
  });

  app.put('/api/categorys', (req, res) => {
    const { categorys } = req.body;
    updateCategorys(categorys).then(
      results => { res.send(results); },
      error => { res.send(error); }
    );
  });
};

module.exports = letureAPI;