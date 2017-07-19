const Group = require('./model');

const getAllGroupsByType = (type) => {
  return new Promise((resolve, reject) => {
    Group
    .find({ type })
    .exec((error, results) => {
      if (error) { console.log(error); reject(error); }
      else resolve(results);
    });
  });
};

const getAllGroups = () => {
  return new Promise((resolve, reject) => {
    Group
    .find()
    .exec((error, results) => {
      if (error) { console.log(error); reject(error); }
      else resolve(results);
    });
  });
};

const createGroup = (name, type) => {
  return new Promise((resolve, reject) => {
    Group
    .findOne({ name })
    .exec((error, group) => {
      if (error) { console.log(error); reject(error); }
      else if(group) {reject({ alreadyExists: true })}
      else {
        const newGroup = new Group({
          name,
          type,
        });

        newGroup.save((error) => {
          if (error) { console.log(error); reject({ create: false }); }
          else { console.log(newGroup); resolve(Object.assign({}, newGroup, { created: true })); }
        });
      }
    });
  });
};

const deleteGroup = (id, type) => {
  return new Promise((resolve, reject) => {
    Group
    .remove({ _id: id })
    .exec((error) => {
      if (error) { console.log(error); reject(error); }
      else resolve('deleted')
    });
  });
};

const reNameGroup = (id, name, type) => {
  return new Promise((resolve, reject) => {
    Group
    .findOne( {name})
    .exec((error, result) => {
      if (error) {console.log(error);}
      else if (result) {reject({alreadyExists: true})}
      else {
        Group
        .update({ _id: id, type }, { name })
        .exec(error => {
          if (error) { console.log(error); reject({renamed: false}); }
          else resolve({renamed: true})
        });
      }
    });
  });
};

module.exports = {
  getAllGroupsByType,
  createGroup,
  getAllGroups,
  deleteGroup,
  reNameGroup,
}