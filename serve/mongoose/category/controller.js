const Category = require('./model');

const getCategory = () => {
  return new Promise((resolve, reject) => {
    Category
    .find()
    .sort({ categore_order: 1 })
    .exec((error, results) => {
      if (error) { console.log(error); reject(error); }
      else resolve(results);
    });
  });
};

const createCategory = (category_name, order) => {
  return new Promise((resolve, reject) => {
    Category
    .findOne({ category_name })
    .exec((error, group) => {
      if (error) { console.log(error); reject(error); }
      else if(group) {reject({ alreadyExists: true })}
      else {
        const newCategory = new Category({category_name, categore_order: order});
        newCategory.save(err => {
          if (err) {reject({create: false});}
          else {resolve(Object.assign({}, newCategory, { created: true }));}
        })
      }
    });
  });
};

const deleteCategory = id => {
  return new Promise((resolve, reject) => {
    Category
    .remove({ _id: id })
    .exec((error) => {
      if (error) { console.log(error); reject(error); }
      else resolve('deleted')
    });
  });
};

const updateCategory = (id, order) => {
  return new Promise((resolve, reject) => {
    Category
    .findByIdAndUpdate(id, { categore_order: order })
    .exec(err => {
      if (err) {reject(err);}
      else {resolve('ordered');}
    })
  });
};

module.exports = {
  getCategory,
  createCategory,
  deleteCategory,
  orderCategory
}