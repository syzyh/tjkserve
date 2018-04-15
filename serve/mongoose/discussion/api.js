// discussion controllers
const getDiscussionByUserId = require('./controller').getDiscussionByUserId;
const getDiscussionById = require('./controller').getDiscussionById;
const createDiscussion = require('./controller').createDiscussion;
const toggleFavorite = require('./controller').toggleFavorite;
const deleteDiscussion = require('./controller').deleteDiscussion;

const {apiUrl} = require('../../../config/serverConfig');
/**
 * discussion apis
 */
const discussionAPI = (app) => {
  // get signle discussion
  app.get(apiUrl+'/discussion', (req, res) => {
    const { user_id, id } = req.query;
    if (user_id) {
      console.log("get my discussions user_id:", user_id);
      getDiscussionByUserId(user_id).then(
        (result) => { 
          res.send({discussions:result, success: true}); 
        },
        (error) => { res.send(error); }
      );
    } else if (id) {
      console.log(id);
      getDiscussionById(id).then(
        (result) => { 
          console.log(result);
          res.send(result[0]); 
        },
        (error) => { res.send(error); }
      );
    }
  });

  // // toggle favorite to the discussion
  // app.put('/api/discussion/toggleFavorite/:discussion_id', (req, res) => {
  //   const { discussion_id } = req.params;
  //   if (req.user) {
  //     // TODO: describe the toggle process with comments
  //     toggleFavorite(discussion_id, req.user._id).then(
  //       (result) => {
  //         getDiscussion(result.discussion_slug).then(
  //           (result) => { res.send(result); },
  //           (error) => { res.send({ discussionUpdated: false }); }
  //         );
  //       },
  //       (error) => { res.send({ discussionUpdated: false }); }
  //     );
  //   } else {
  //     res.send({ discussionUpdated: false });
  //   }
  // });

  // create a new discussion
  app.post(apiUrl+'/discussion', (req, res) => {
    const {discussion} = req.body;
    if (!req.session.user) {
      res.send({error: '尚未登录'});
    } else {
      const user_id = req.session.user._id;
      if (discussion) {
        createDiscussion(discussion, user_id).then(
          (result) => { res.send(Object.assign({}, {discussion: result})); },
          (error) => { res.send({ error: '发布讨论失败'}); }
        );
      } else {
        res.send({ error: '发布讨论失败'});
      }
    }
  });

  // delete a discussion
  app.delete(apiUrl+'/discussion', (req, res) => {
    console.log(req.query.discussion_id);
      deleteDiscussion(req.query.discussion_id).then(
        (result) => { res.send({ deleted: true }); },
        (error) => { res.send({ deleted: false }); }
      );
  });
};

module.exports = discussionAPI;
