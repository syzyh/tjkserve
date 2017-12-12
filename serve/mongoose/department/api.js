const { getDepartments, deleteDepartment, createDepartment, updateDepartment } = require('./controller');
const apiUrl = '/serve/api';

const departmentAPI = (app) => {
  app.get(apiUrl+'/department', (req, res) => {
    getDepartments().then(
      result => {res.send(result);},
      err => {res.send(err);}
    )
  });

  app.delete(apiUrl+'/department', (req, res) => {
    const { id } = req.query;
    deleteDepartment(id).then(
      result => {res.send(result);},
      err => {res.send(err);}
    );
  });

  app.post(apiUrl+'/department', (req, res) => {
    const { id, name, imgUrl, urlName, order } = req.body;
    createDepartment(id, name, imgUrl, urlName, order).then(
      result => {res.send(result);},
      err => {res.send(err);}
    );
  });

  app.put(apiUrl+'/department', (req, res) => {
    const { id, name, imgUrl, urlName, order } = req.body;
    updateDepartment(id, name, imgUrl, urlName, order).then(
      result => {res.send({updated: true});},
      err => {res.send(err);}
    );
  });
};

module.exports = departmentAPI;
