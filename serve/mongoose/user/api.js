const { signIn } = require('./controller');
const {apiUrl} = require('../../../config/serverConfig');

const userAPI = (app) => {
  app.post(apiUrl+'/user/signIn', (req, res) => {
      const {name} = req.body;
      if (name) {
        console.log(name);
        signIn(name).then(
          result => {
            console.log(result);
            req.session.user = result;
            res.send(result)
          },
          error => res.send(error)
        )
      } else {
        console.log(req.session.user);
        if (req.session.user) {
          res.send(req.session.user);
        } else {
          res.send({noName: true});
        }
      }
  });
};

module.exports = userAPI;