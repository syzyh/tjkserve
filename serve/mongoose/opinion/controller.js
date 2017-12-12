const asyncEach = require('async/each');
// models
const Opinion = require('./model');
const User = require('../user/model');

const getAllOpinions = (discussion_id) => {
  const findObject = discussion_id ? {discussion_id, opinion_id: null} : {};
  return new Promise((resolve, reject) => {
    Opinion
    .find(findObject)
    .populate('user')
    .sort({ date: -1 })
    .lean()
    .exec((error, opinions) => {
      if (error) { console.log(error); reject(error); }
      else if (!opinions) {
        reject(null);
      } else {
        asyncEach(opinions, (eachOpinion, callback) => {
          Opinion
          .find({opinion_id: eachOpinion._id})
          .populate('user')
          .sort({ date: 1 })
          .exec((error, replys) => {
            eachOpinion.replys = replys;
            callback();
            });
          },
          (error) => {
            if (error) {console.log(error); reject(error);}
            else {resolve(opinions)};
          }
        );
      };
    });
  });
};

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
      else { resolve(result._doc); }
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
  getAllOpinions,
  createOpinion,
  toggleFavorite,
  updateOpinion,
  deleteOpinion,
};
