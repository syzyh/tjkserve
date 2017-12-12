const asyncEach = require('async/each');
const getAllOpinions = require('../opinion/controller').getAllOpinions;
// const getUser = require('../user/controller').getUser;

const Discussion = require('./model');
const Opinion = require('../opinion/model');

/**
 * get a single discussion
 * @param  {String} discussion_slug
 * @param  {String} discussion_id
 * @return {Promise}
 */
const getDiscussions = (branch_name) => {
  if (branch_name) {
  return new Promise((resolve, reject) => {
    Discussion
    .find({branch_name})
    .populate('user')
    .lean()
    .exec((error, discussions) => {
      if (error) { console.log(error); reject(error); }
      else if (!discussions) reject(null);
      else {
        asyncEach(discussions, (eachDiscussion, callback) => {
        // add opinions to the discussion object
          getAllOpinions(eachDiscussion._id).then(
            (opinions) => {
              eachDiscussion.opinions = opinions;
              callback();
            },
            (error) => { {reject(error); } }
          )},
          (error) => {
            if (error) {console.log(error); reject(error);}
            else {resolve(discussions)};
          }
        );
      }
    });
  });
  } else {
    return Discussion.find().populate('user').exec();
  }
};

/**
 * Create a new discussion
 * @param  {Object} discussion
 * @return {Promise}
 */
const createDiscussion = (discussion, user_id) => {
  return new Promise((resolve, reject) => {
    const newDiscussion = new Discussion({
      branch_name: discussion.branch_name,
      user: user_id,
      create_date: new Date(Date.now() + (8 * 60 * 60 * 1000)),
      modified_data: new Date(Date.now() + (8 * 60 * 60 * 1000)),
      title: discussion.title,
      content: discussion.content,
      favorites: [],
    });

    newDiscussion.save((error) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      newDiscussion._doc.opinions = [];
      resolve(newDiscussion._doc);
    });
  });
};

/**
 * toggle favorite status of discussion
 * @param  {ObjectId} discussion_id
 * @param  {ObjectId} user_id
 * @return {Promise}
 */
const toggleFavorite = (discussion_id, user_id) => {
  return new Promise((resolve, reject) => {
    Discussion.findById(discussion_id, (error, discussion) => {
      if (error) { reject(error); }
      else if (!discussion) reject(null);
      else {
        // add or remove favorite
        let matched = null;
        for (let i = 0; i < discussion.favorites.length; i++) {
          if (String(discussion.favorites[i]) === String(user_id)) {
            matched = i;
          }
        }

        if (matched === null) {
          discussion.favorites.push(user_id);
        } else {
          discussion.favorites = [
            ...discussion.favorites.slice(0, matched),
            ...discussion.favorites.slice(matched + 1, discussion.favorites.length),
          ];
        }

        discussion.save((error, updatedDiscussion) => {
          if (error) { console.log(error); reject(error); }
          resolve(updatedDiscussion);
        });
      }
    });
  });

};

const updateDiscussion = (forum_id, discussion_slug) => {
  // TODO: implement update feature
};

const deleteDiscussion = (discussion_id) => {
  return new Promise((resolve, reject) => {
    // find the discussion id first
    console.log(discussion_id);
    Discussion
    .remove({ _id: discussion_id })
    .exec((error, discussion) => {
      if (error) { console.log(error); reject(error); }
      // remove any opinion regarding the discussion
      Opinion
      .remove({ discussion_id })
      .exec((error) => {
        if (error) { console.log(error); reject(error); }

        // finally remove the discussion
        else {
          resolve({deleted: true});
        }
      });
    });
  });
};

module.exports = {
  getDiscussions,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  toggleFavorite,
};
