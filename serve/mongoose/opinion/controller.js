const asyncEach = require('async/each');
//controllers
const getDiscussionById = require('../discussion/controller').getDiscussionById;

// models
const Opinion = require('./model');
const User = require('../user/model');

const createOpinion = ({ discussion_id, user_id, content, opinion_id, toward_user }) => {
  return new Promise((resolve, reject) => {
    const newOpinion = new Opinion({
      discussion_id,
      user: user_id,
      content,
      date: new Date(Date.now() + (8 * 60 * 60 * 1000)),
      favorites: [],
      opinion_id,
      toward_user,
    });

    newOpinion.save((error, result) => {
      if (error) { console.log(error); reject(error); }
      else { 
        getDiscussionById(discussion_id).then(
          (result) => { 
            console.log("create opinion result:", result[0]);
            resolve(result[0]); 
          },
          (error) => { reject(error); }
        ); 
      }
    });
  });
};

const toggleFavorite = (opinion_id, user_id) => {
  return new Promise((resolve, reject) => {
    Opinion.findById(opinion_id, (error, opinion) => {
      if (error) { console.log(error); reject(error); }
      else if (!opinion) reject(null);
      else {
        // add or remove favorite
        let matched = null;
        for (let i = 0; i < opinion.favorites.length; i++) {
          if (String(opinion.favorites[i]) === String(user_id)) {
            matched = i;
          }
        }

        if (matched === null) {
          opinion.favorites.push(user_id);
        } else {
          opinion.favorites = [
            ...opinion.favorites.slice(0, matched),
            ...opinion.favorites.slice(matched + 1, opinion.favorites.length),
          ];
        }

        opinion.save((error, updatedOpinion) => {
          if (error) { console.log(error); reject(error); }
          resolve(updatedOpinion);
        });
      }
    });
  });

};

const updateOpinion = (opinion_id) => {
  // TODO: implement update for opinion
};

const deleteOpinion = (opinion_id) => {
  return new Promise((resolve, reject) => {
    Opinion
    .remove({ _id: opinion_id })
    .exec((error) => {
      if (error) { console.log(error); reject(error); }
      else resolve('deleted');
    });
  });
};

module.exports = {
  createOpinion,
  toggleFavorite,
  updateOpinion,
  deleteOpinion,
};
