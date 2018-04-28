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
    const query = Discussion.where('department_id').in(subscriptionList);
    return enrichDiscussions(query);
};

const signUp = (openid, userName, avatarUrl) => {
  return new Promise((resolve, reject) => {
    if(!userName || !openid || !avatarUrl ) reject();
    console.log("sign up:", openid, userName, avatarUrl);
    const newUser = new User({openid, userName, avatarUrl});
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
    .findOne({openid})
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
                resovle(result);
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

/**
 * sign in/up user via github provided info
 * this will signin the user if user existed
 * or will create a new user using git infos
 * @param  {Object} gitProfile    profile information provided by github
 * @return {promise}              user doc
 */
const signInViaGithub = (gitProfile) => {
  return new Promise((resolve, reject) => {

    // find if user exist on db
    User.findOne({ username: gitProfile.username }, (error, user) => {
      if (error) { console.log(error); reject(error); }
      else {
        // get the email from emails array of gitProfile
        const email = _.find(gitProfile.emails, { verified: true }).value;

        // user existed on db
        if (user) {
          // update the user with latest git profile info
          user.name = gitProfile.displayName;
          user.username = gitProfile.username;
          user.avatarUrl = gitProfile._json.avatar_url;
          user.email = email;
          user.github.id = gitProfile._json.id,
          user.github.url = gitProfile._json.html_url,
          user.github.company = gitProfile._json.company,
          user.github.location = gitProfile._json.location,
          user.github.hireable = gitProfile._json.hireable,
          user.github.bio = gitProfile._json.bio,
          user.github.followers = gitProfile._json.followers,
          user.github.following = gitProfile._json.following,

          // save the info and resolve the user doc
          user.save((error) => {
            if (error) { console.log(error); reject(error); }
            else { resolve(user); }
          });
        }

        // user doesn't exists on db
        else {
          // check if it is the first user (adam/eve) :-p
          // assign him/her as the admin
          User.count({}, (err, count) => {
            console.log('usercount: ' + count);

            let assignAdmin = false;
            if (count === 0) assignAdmin = true;

            // create a new user
            const newUser = new User({
              name: gitProfile.displayName,
              username: gitProfile.username,
              avatarUrl: gitProfile._json.avatar_url,
              email: email,
              role: assignAdmin ? 'admin' : 'user',
              github: {
                id: gitProfile._json.id,
                url: gitProfile._json.html_url,
                company: gitProfile._json.company,
                location: gitProfile._json.location,
                hireable: gitProfile._json.hireable,
                bio: gitProfile._json.bio,
                followers: gitProfile._json.followers,
                following: gitProfile._json.following,
              },
            });

            // save the user and resolve the user doc
            newUser.save((error) => {
              if (error) { console.log(error); reject(error); }
              else { resolve(newUser); }
            });

          });
        }
      }
    });

  });
};

/**
 * get the full profile of a user
 * @param  {String} username
 * @return {Promise}
 */
const getFullProfile = (username) => {
  return new Promise((resolve, reject) => {
    User
    .findOne({ username })
    .lean()
    .exec((error, result) => {
      if (error) { console.log(error); reject(error); }
      else if (!result) reject('not_found');
      else {
        // we got the user, now we need all discussions by the user
        Discussion
        .find({ user_id: result._id })
        .populate('forum')
        .lean()
        .exec((error, discussions) => {
          if (error) { console.log(error); reject(error); }
          else {
            // we got the discussions by the user
            // we need to add opinion count to each discussion
            asyncEach(discussions, (eachDiscussion, callback) => {
              getAllOpinions(eachDiscussion._id).then(
                (opinions) => {
                  // add opinion count to discussion doc
                  eachDiscussion.opinion_count = opinions ? opinions.length : 0;
                  callback();
                },
                (error) => { console.error(error); callback(error); }
              );
            }, (error) => {
              if (error) { console.log(error); reject(error); }
              else {
                result.discussions = discussions;
                resolve(result);
              }
            });
          }
        });
      }
    });
  });
};

module.exports = {
  signInViaGithub,
  getUser,
  getFullProfile,
  signIn,
  signInByCode,
  userSubscribe,
};
