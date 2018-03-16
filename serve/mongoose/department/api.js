const { getAllDepartments,getDepartmentByName, deleteDepartment, createDepartment, updateDepartment } = require('./controller');
const {apiUrl} = require('../../../config/serverConfig');

const departmentAPI = (app) => {
  app.get(apiUrl+'/department', (req, res) => {
    const { branch_name } = req.query;
    if (branch_name) {
      getDepartmentByName(branch_name).then(
        result => {res.send(result);},
        err => {res.send(err);}
      )
    } else {
      getAllDepartments().then(
        result => {res.send(result);},
        err => {res.send(err);}
      )
    }
  });

  app.delete(apiUrl+'/department', (req, res) => {
    const { id } = req.query;
    deleteDepartment(id).then(
      result => {res.send(result);},
      err => {res.send(err);}
    );
  });

  app.post(apiUrl+'/department', (req, res) => {
    const { id, name, imgUrl, urlName, order, imgUrl2 } = req.body;
    createDepartment(id, name, imgUrl, urlName, order, imgUrl2).then(
      result => {res.send(result);},
      err => {res.send(err);}
    );
  });

  app.put(apiUrl+'/department', (req, res) => {
    const { id, name, imgUrl, urlName, order, imgUrl2 } = req.body;
    updateDepartment(id, name, imgUrl, urlName, order, imgUrl2).then(
      result => {res.send({updated: true});},
      err => {res.send(err);}
    );
  });
};

module.exports = departmentAPI;
