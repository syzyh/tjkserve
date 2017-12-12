const { deleteGroup, createGroup, getAllGroups, getAllGroupsByType, reNameGroup } = require('./controller');
const {apiUrl} = require('../../../../config/serverConfig');

const groupAPI = (app) => {
  app.get(apiUrl+'/group', (req, res) => {
    if (req.query.type) {
      getAllGroupsByType(req.query.type).then(
        result => { res.send(result); },
        error => { res.send(error) }
      );
    } else {
      getAllGroups().then(
        result => { res.send(result); },
        error => { res.send(error) }
      );
    }
  });

  app.post(apiUrl+'/group', (req, res) => {
    const { name, type } = req.body;
    createGroup(name, type).then(
      result => { res.send(result); },
      error => {  res.send(error); }
    )
  });

  app.delete(apiUrl+'/group', (req, res) => {
    console.log(req.query);
    if (req.query.id) {
      deleteGroup(req.query.id).then(
        result => res.send({deleted: true}),
        error => res.send({deleted: false})
      );
    }
  });

  app.put(apiUrl+'/group', (req, res) => {
    const { id, name } = req.body;
    if (name && id) {
      reNameGroup(id, name).then(
        result => res.send(result),
        error => res.send(error)
      );
    }
  });
};

module.exports = groupAPI;