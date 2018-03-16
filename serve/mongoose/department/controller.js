const Department = require('./model');
const Discussion = require('../discussion/model');
const Audio = require('../audio/model');

const enrichDiscussions = require('../discussion/controller').enrichDiscussions;

const getAllDepartments = () => {
  return Department.find({}).exec();
}

const getDepartmentByName = (department_urlName) => {
  return new Promise((resolve, reject) => {
    Department
    .findOne({department_urlName})
    .exec((error, department) => {
      if (error) { console.log(error); reject(error); }
      else {
        console.log("department finded:", department);
        const audiosPromise = Audio.find({department_id : department._id}).sort({ audio_order: -1 }).exec();
        const discussionsPromise = enrichDiscussions(Discussion.find({department_id: department._id}).sort({ date: -1 }));
        Promise
        .all([audiosPromise, discussionsPromise])
        .then(
          result => {
            resolve({department, audios: result[0], discussions: result[1]});
          },
          error => {console.log(error);reject(error);}
        );
      }
    });
  });
};

const deleteDepartment = _id => {
  return Department.remove({_id}).exec();
};

const createDepartment = (category_id, department_name, department_imgUrl, department_urlName, department_order, department_imgUrl2) => {
  return new Promise((resolve, reject) => {
    Department
    .findOne({ department_name })
    .exec((error, group) => {
      if (error) { console.log(error); reject(error); }
      else if(group) {reject({ alreadyExists: true })}
      else {
        const newDepartment = new Department({category_id, department_name, department_imgUrl, department_urlName, department_order, department_imgUrl2});
        newDepartment.save(err => {
          if (err) {console.log(err); reject({create: false});}
          else {resolve(Object.assign({}, newDepartment, { created: true }));}
        });
      }
    });
  });
};

const updateDepartment = (id, department_name, department_imgUrl, department_urlName, department_order, department_imgUrl2) => {
  return Department.findByIdAndUpdate(id, {department_name, department_imgUrl, department_urlName, department_order, department_imgUrl2}).exec();
}

module.exports = {
  getAllDepartments,
  getDepartmentByName,
  deleteDepartment,
  createDepartment,
  updateDepartment
}