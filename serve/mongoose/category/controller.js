const _ = require('lodash');
const asyncEach = require('async/each');

const Category = require('./model');

const getCategory = () => {
  return new Promise((resolve, reject) => {
    Category
    .find()
    .sort({ categore_order: 1 })
    .exec((error, results) => {
      if (error) { console.log(error); reject(error); }
      else {
        if (_.findIndex(results, c=>c.category_name === "轮播") < 0) {
          createCategory('轮播', -9999).then(
            result => {
              if (result.created) {
                results.unshift(result._doc);
                console.log(results);
                resolve(results);
              } else {
                reject(result);
              }
            },
            err => {reject(err);}
          )
        } else {
          resolve(results);
        }
      }
    });
  });
};

const createCategory = (category_name, category_order) => {
  return new Promise((resolve, reject) => {
    Category
    .findOne({ category_name })
    .exec((error, group) => {
      if (error) { console.log(error); reject(error); }
      else if(group) {reject({ alreadyExists: true })}
      else {
        const newCategory = new Category({category_name, category_order});
        newCategory.save(err => {
          if (err) {reject({created: false});}
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

const updateCategory = (id, name, order) => {
  console.log(id, name, order);
  return new Promise((resolve, reject) => {
    Category
    .findByIdAndUpdate(id, { category_name: name, category_order: order })
    .exec(err => {
      if (err) {reject(err);}
      else {resolve('updated');}
    })
  });
};

const updateCategorys = categorys => {
  return new Promise((resolve, reject) => {
    asyncEach(categorys, (category, callback) => {
      orderCategory(category.id, category.name, category.order).then(
        () => { callback(); },
        error => { console.error(error); callback(error); }
      );
    },
    (error) => {
      if (error) { console.error(error); reject(error); }
      else resolve('updated');
    });
  });
};

module.exports = {
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  updateCategorys
}