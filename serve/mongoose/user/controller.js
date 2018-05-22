const _ = require('lodash');
const request = require('request');
const asyncEach = require('async/each');
// controllers
const enrichDiscussions = require('../discussion/controller').enrichDiscussions;

// models
const Department = require('../department/model');
const User = require('./model');
const Discussion = require('../discussion/model');
const Audio = require('../audio/model');

const getNewUpdateAudio = (subscriptionList) => {
  return new Promise((resolve, reject) => {
    //console.log("subscriptionList in query:", subscriptionList);
    Audio
    .where('department_id')
    .in(subscriptionList)
    .exec((error, result) => {
      if (error) {
        console.log("get new update audio error:", error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

const getNewUpdateDiscussion = (subscriptionList) => {
    //console.log("subscriptionList in params", subscriptionList);
    const query = Discussion.where('department_id').in(subscriptionList).sort({ modified_date: -1 });
    return enrichDiscussions(query);
};

const signUp = (openid, userName, avatarUrl) => {
  return new Promise((resolve, reject) => {
    if(!userName || !openid || !avatarUrl ) reject();
    console.log("sign up:", openid, userName, avatarUrl);
    const newUser = new User({openid, userName, avatarUrl, created_time: new Date(Date.now())});
    newUser.save((error, user) => {
      if (error) reject(error);
      else {
        resolve(user);
      };
    });
  });
};

const signInByOpenid = openid => {
  return new Promise((resolve, reject) => {
    console.log("sign in by openid", openid);
    User
    .findOneAndUpdate({openid}, {lastSkim_time: new Date(Date.now())})
    .populate('subscriptionList')
    .lean()
    .exec((error, user) => {
      if (error) {reject(error);}
      else {
        if (!user) {reject({noUser: true})}
        else {
          Promise
          .all([getNewUpdateAudio(user.subscriptionList), getNewUpdateDiscussion(user.subscriptionList)])
          .then(
            result => {
              user.subscriptionAudios = result[0];
              user.subscriptionDiscussions = result[1];
              resolve(user);
            },
            error => {reject(error);}
          );
        }
      }
    });
  });
};

const signInByCode = code => {
  return new Promise((resolve, reject) => {
    console.log("code in begin", code);
    request(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx4a7a656e121fa87f&secret=74edc08d6a9c5a20199262acb61e08e3&code=${code}&grant_type=authorization_code`, (error, res, body) => {
      if (error) {console.log(error); reject(error)}
      console.log('sign by code:', body);
      const newData = JSON.parse(body)
      const {access_token, openid} = newData;
      signInByOpenid(openid).then(
        result => {
          console.log("sign in resovle:", result);
          resolve(result);
        }, error => {
          console.log(error);
          request(` https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`, (err, res, body) => {
            if(err) {
              console.log(err);
              reject(err);
            }
            const {openid, nickname, headimgurl} = JSON.parse(body);
            console.log("user info:", openid, nickname);
            signUp(openid, nickname, headimgurl).then(
              result => {
                console.log("sign up resovle:", result);
                resolve(result);
              }, 
              error => {
                console.log(error);
                reject(error);
              }
            );
          });
        }
      );
    });
  });
};

const signIn = (userName) => {
  return new Promise((resolve, reject) => {
    if(!userName) reject();
    console.log("user name:", userName);
    User
    .findOne({userName})
    .populate('subscriptionList')
    .lean()
    .exec((error, user) => {
      if (error) {reject(error);}
      else {
        if (!user) {
          const newUser = new User({userName});
          newUser.save((error, user) => {
            if (error) reject(error);
            else {
              resolve(user);
            };
          });
        } else {
          // console.log("user subscription list:", user.subscriptionList)
          Promise
          .all([getNewUpdateAudio(user.subscriptionList), getNewUpdateDiscussion(user.subscriptionList)])
          .then(
            result => {
              user.subscriptionAudios = result[0];
              user.subscriptionDiscussions = result[1];
              resolve(user);
            },
            error => {reject(error);}
          );
        }
      }
    });
  });
};

const userSubscribe = (user_id, department_id) => {
  // console.log("userid and departmentid:", user_id, department_id);
  return new Promise((resolve, reject) => {
    User.findById(user_id).exec((error, user) => {
      if(error) {console.log(error); reject(error);}
      else if(!user) reject(null);
      else {
        const lastLength = user.subscriptionList.length;
        const newList = _.filter(user.subscriptionList, d => {
          console.log('user subscibe:', d ,department_id);
          return d.toString() != department_id;
        });
        if (newList.length === lastLength) newList.push(department_id);

        user.subscriptionList = newList;
        user.save((error, updatedUser) => {
          if (error) reject(error);
          else {
            Department
            .where('_id')
            .in(updatedUser.subscriptionList)
            .exec((error, result) => {
              if (error) {
                console.log( error);
                reject(error);
              } else {
                resolve(result);
              }
            })
          };
        })
      }
    });
  });
};

/**
 * get user doc by user id
 * @param  {ObjectId} user_id
 * @return {promise}
 */
const getUser = (user_id) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: user_id }, (error, user) => {
      if (error) { console.log(error); reject(error); }
      else if (!user) reject(null);
      else resolve(user);
    });
  });
};

const getUsersByName = (userName) => {
  return new Promise((resolve, reject) => {
    User.find({userName}).exec((error, users) => {
      if (error) {
        reject(error);
      } else {
        resolve(users);
      }
    });
  });
};

const changeUserRole = (id, role) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, {role}).exec((error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    })
  })
}

module.exports = {
  getUser,
  signIn,
  signInByCode,
  userSubscribe,
  getUsersByName,
  changeUserRole,
};
