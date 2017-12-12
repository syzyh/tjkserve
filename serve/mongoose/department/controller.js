const Department = require('./model');

const getDepartments = (department_urlName) => {
  if (department_urlName) {
    return Department.findOne({department_urlName}).exec();
  } else {
    return Department.find({}).exec();
  }
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
  getDepartments,
  deleteDepartment,
  createDepartment,
  updateDepartment
}