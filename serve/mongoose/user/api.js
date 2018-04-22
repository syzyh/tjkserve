const { signIn, userSubscribe, signUp, signInByOpenid } = require('./controller');
const {apiUrl} = require('../../../config/serverConfig');

const userAPI = (app) => {
  app.post(apiUrl+'/user/signOut', (req, res) => {
    req.session.user = null;
    res.send({success: true});
  });

  app.post(apiUrl+'/user/signUp', (req, res) => {
    const {openid, userName, avatarUrl} = req.body;
    signUp(openid, userName, avatarUrl).then(
      result => {
        req.session.user = result;
        res.send(result);
      },
      error => {
        res.send(error);
      }
    )
  });

  app.post(apiUrl+'/user/signInByOpenid', (req, res) => {
    const {openid} = req.body;
    if (openid) {
      signInByOpenid(openid).then(
        result => {
          req.session.user = result;
          res.send(result);
        },
        error => {
          console.log("error in sign in by openid:", error);
          if (error.noUser) {
            res.send({noUser: true})
          } else {
            res.send({fail: true});
          }
        }
      )
    }
  });

  app.post(apiUrl+'/user/signIn', (req, res) => {
      const {name} = req.body;
      if (name) {
        console.log(name);
        signIn(name).then(
          result => {
            req.session.user = result;
            res.send(result)
          },
          error => res.send(error)
        )
      } else {
        console.log(req.session.user);
        if (req.session.user && req.session.user.user) {
          signIn(req.session.user.userName).then(
            result => {
              req.session.user = result;
              res.send(result)
            },
            error => res.send(error)
          )
        } else {
          res.send({noName: true});
        }
      }
  });

  app.post(apiUrl+'/user/subscription', (req, res) => {
    let {user_id, department_id} = req.body;
    if (!user_id) user_id = req.session.user.id;
    if (user_id) {
      console.log('subscribe api:', user_id, department_id);
      userSubscribe(user_id, department_id).then(
        result => {
          req.session.user = result;
          res.send({success: true, subscriptionList: result});
        },
        error => {
          console.log(error);
          res.send({success: false})
        }
      );
    }
  });
};

module.exports = userAPI;