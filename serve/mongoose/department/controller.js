const Department = require('./model');

const getDepartments = () => {
  return Department.find({}).exec();
};

const deleteDepartment = _id => {
  return Department.remove({_id}).exec();
};

const createDepartment = (department_name, department_imgUrl) => {
  return new Promise((resolve, reject) => {
    Department
    .findOne({ department_name })
    .exec((error, group) => {
      if (error) { console.log(error); reject(error); }
      else if(group) {reject({ alreadyExists: true })}
      else {
        const newDepartment = new Department({department_name, department_imgUrl});
        newCategory.save(err => {
          if (err) {reject({create: false});}
          else {resolve(Object.assign({}, newCategory, { created: true }));}
        })
    });
  });
}