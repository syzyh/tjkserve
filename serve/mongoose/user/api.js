const { signIn, userSubscribe, signInByCode, getUsersByName, changeUserRole } = require('./controller');
const {apiUrl} = require('../../../config/serverConfig');

const userAPI = (app) => {
  app.post(apiUrl+'/user/signInByCode', (req,res) => {
    const { code } = req.body;
    signInByCode(code).then(
      result => {
        req.session.user = result;
        console.log("session user:", req.session.user);
        console.log("sign in by code result api:", result);
        res.send(result);
      },
      error => {
        console.log(error);
        res.send({failure: true, error});
      }
    )
  });

  app.post(apiUrl+'/user/signOut', (req, res) => {
    req.session.user = null;
    res.send({success: true});
  });

  app.get(apiUrl+'/user', (req, res) => {
    const {name} = req.query
    getUsersByName(name).then(
      result => {
        res.send(result);
      },
      error => {
        res.send(error);
      }
    )
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
          res.send({success: false});
        }
      );
    }
  });

  app.post(apiUrl+'/user/role', (req, res) => {
    const {id, role} = req.body;
    if (!!id && !!role) {
      changeUserRole(id, role).then(
        result => {
          res.send({success: true, user: result});
        },
        error => {
          res.send({success: false});
        }
      );
    }
  });
};

module.exports = userAPI;