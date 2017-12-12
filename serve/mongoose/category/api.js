const { getCategory, deleteCategory, createCategory, updateCategory, updateCategorys } = require('./controller');
const apiUrl = '/serve/api';

const categoryAPI = (app) => {
  app.get(apiUrl+'/category', (req, res) => {
    getCategory().then(
      result => {res.send(result);},
      err => {res.send(err);}
    )
  });

  app.post(apiUrl+'/category', (req, res) => {
    const { name, order,type } = req.body;
    createCategory(name, order).then(
      result => {res.send(result);},
      err => {res.send(err);}
    )
  });

  app.delete(apiUrl+'/category', (req, res) => {
    const { id } = req.query;
    deleteCategory(id).then(
      result => {res.send(result)},
      err => {res.send(err)}
    )
  });

  app.put(apiUrl+'/category', (req, res) => {
    const { id, name, order} = req.body;
    updateCategory(id, name, order).then(
      results => {res.send(results);},
      err => {res.send(err)}
    );
  });

  app.put(apiUrl+'/categorys', (req, res) => {
    const { categorys } = req.body;
    updateCategorys(categorys).then(
      results => { res.send(results); },
      error => { res.send(error); }
    );
  });
};

module.exports = categoryAPI;