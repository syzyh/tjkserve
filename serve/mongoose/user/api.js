const { signIn, userSubscribe } = require('./controller');
const {apiUrl} = require('../../../config/serverConfig');

const userAPI = (app) => {
  app.post(apiUrl+'/user/signOut', (req, res) => {
    req.session.user = null;
    res.send({success: true});
  });

  app.post(apiUrl+'/user/signIn', (req, res) => {
      const {name} = req.body;
      if (name) {
        console.log(name);
        signIn(name).then(
          result => {
            //console.log(result);
            req.session.user = result;
            res.send(result)
          },
          error => res.send(error)
        )
      } else {
        console.log(req.session.user);
        if (req.session.user) {
          signIn(req.session.user.userName).then(
            result => {
              //console.log(result);
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
      userSubscribe(user_id, department_id).then(
        result => {
          console.log(result);
          req.session.user = result;
          res.send({success: true, user: result});
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