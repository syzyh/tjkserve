// controllers
//const getAllOpinions = require('./controller').getAllOpinions;
const createOpinion = require('./controller').createOpinion;
const deleteOpinion = require('./controller').deleteOpinion;
const getAllOpinions = require('./controller').getAllOpinions;

const {apiUrl} = require('../../../config/serverConfig');
/**
 * opinion apis
 */
const opinionAPI = (app) => {
  app.get(apiUrl + '/opinion', (req, res) => {
    const {toward_user} = req.query;
    getAllOpinions({toward_user}).then(
      result => {res.send(result);},
      error => {res.send({error: '获取评论消息失败'})}
    )
  });
  // create an opinion
  app.post(apiUrl + '/opinion', (req, res) => {
    console.log(req.body);
    if (!req.session.user || req.session.user.role === 'baned') {
      res.send({error: '尚未登录'});
    } else {
      const opinionParams = Object.assign({}, req.body, {user_id: req.session.user._id});
      createOpinion(opinionParams).then(
        (result) => { res.send(result); },
        (error) => { res.send({error: '发表评论失败'}); }
      );
    }
  });

  // toggle favorite to the discussion
  app.put(apiUrl + '/opinion/toggleFavorite', (req, res) => {
    const { opinion_id, user_id } = req.body;
      // TODO: describe the toggle process with comments
    toggleFavorite(opinion_id, user_id).then(
      (result) => {
        res.send({updated: true, opinion: result._doc});
      },
      (error) => { res.send({ updated: false }); }
    );
  });

  // remove an opinion
  app.delete(apiUrl + '/opinion', (req, res) => {
    console.log("api delete:", req.params);
      deleteOpinion(req.query.opinion_id).then(
        (result) => { res.send({ deleted: true }); },
        (error) => { res.send({ deleted: false }); }
      );
  });
};

module.exports = opinionAPI;
