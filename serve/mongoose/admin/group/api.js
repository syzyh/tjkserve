const { deleteGroup, createGroup, getAllGroups, getAllGroupsByType, reNameGroup } = require('./controller');

const groupAPI = (app) => {
  app.get('/api/group', (req, res) => {
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

  app.post('/api/group', (req, res) => {
    const { name, type  } = req.body;
    createGroup(name, type).then(
      result => { res.send(result); },
      error => {  res.send(error); }
    )
  });

  app.delete('/api/group', (req, res) => {
    console.log(req.query);
    if (req.query.id) {
      deleteGroup(req.query.id).then(
        result => res.send({deleted: true}),
        error => res.send({deleted: false})
      );
    }
  });

  app.put('/api/group', (req, res) => {
    const { id, name, type } = req.body;
    if (name && id && type) {
      reNameGroup(id, name, type).then(
        result => res.send(result),
        error => res.send(error)
      );
    }
  });
};

module.exports = groupAPI;