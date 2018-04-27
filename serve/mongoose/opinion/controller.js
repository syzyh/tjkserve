const asyncEach = require('async/each');

// models
const Opinion = require('./model');
const User = require('../user/model');

const getAllOpinions = (findObjects) => {
  const findObject = Object.assign({},findObjects, {opinion_id: null});
  return new Promise((resolve, reject) => {
    Opinion
    .find(findObject)
    .limit(100)
    .populate('user')
    .populate('toward_user')
    .sort({ date: -1 })
    .lean()
    .exec((error, opinions) => {
      if (error) { console.log(error); reject(error); }
      else if (!opinions) {
        reject(null);
      } else {
        asyncEach(opinions,
          (eachOpinion, callback) => {
            Opinion
            .find({opinion_id: eachOpinion._id})
            .limit(50)
            .populate('user')
            .populate('toward_user')
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

const createOpinion = ({ discussion_id,audio_id, user_id, content, opinion_id, toward_user }) => {
  //console.log("create opinion audioid", audio_id);
  return new Promise((resolve, reject) => {
    const newOpinion = new Opinion({
      discussion_id,
      audio_id,
      user: user_id,
      content,
      date: new Date(Date.now()),
      favorites: [],
      opinion_id,
      toward_user,
    });

    newOpinion.save((error, result) => {
      if (error) { console.log(error); reject(error); }
      else { 
        getAllOpinions({audio_id, discussion_id}).then(
          opinions => {
            console.log("new opinions:", opinions);
            resolve(opinions);
          },
          error => {reject(error);}
        )
        // getDiscussionById(discussion_id).then(
        //   (result) => { 
        //     console.log("create opinion result:", result[0]);
        //     resolve(result[0]); 
        //   },
        //   (error) => { reject(error); }
        // ); 
      }
    });
  });
};
         

const updateOpinion = (opinion_id) => {
  // TODO: implement update for opinion
};

const deleteOpinion = (opinion_id) => {
  console.log("delete opinion:", opinion_id)
  return new Promise((resolve, reject) => {
    Opinion
    .deleteOne({ _id: opinion_id })
    .exec((error) => {
      if (error) { console.log(error); reject(error); }
      else {
        Opinion.remove({opinion_id}).exec((error) => {
          if (error) {reject(error)}
          else {resolve({deleted: true})}
        })
      }
    });
  });
};

module.exports = {
  createOpinion,
  updateOpinion,
  deleteOpinion,
  getAllOpinions,
};
