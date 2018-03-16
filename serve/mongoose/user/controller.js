const _ = require('lodash');
const asyncEach = require('async/each');
// controllers
const enrichDiscussions = require('../discussion/controller').enrichDiscussions;

// models
const User = require('./model');
const Discussion = require('../discussion/model');
const Audio = require('../audio/model');

const getNewUpdateAudio = (subscriptionList) => {
  return new Promise((resolve, reject) => {
    console.log("subscriptionList in query:", subscriptionList);
    Audio
    .where('department_id')
    .in(subscriptionList)
    .exec((error, result) => {
      if (error) {
        console.log("get new update audio error:", error);
        reject(error);
      } else {
        //console.log("get new update audio result:", result);
        resolve(result);
      }
    });
  });
}

const getNewUpdateDiscussion = (subscriptionList) => {
    console.log("subscriptionList in params", subscriptionList);
    const query = Discussion.where('department_id').in(subscriptionList);
    return enrichDiscussions(query);
};

const signIn = (userName, req) => {
  console.log("username in signin:",userName);
  return new Promise((resolve, reject) => {
    User
    .findOne({userName})
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
          console.log("user subscription list:", user.subscriptionList)
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
  console.log("userid and departmentid:", user_id, department_id);
  return new Promise((resolve, reject) => {
    User.findById(user_id).exec((error, user) => {
      if(error) {console.log(error); reject(error);}
      else if(!user) reject(null);
      else {
        const lastLength = user.subscriptionList.length;
        const newList = _.filter(user.subscriptionList, d => {
          console.log(d.toString() ,department_id);
          return d.toString() !== department_id;
        });
        if (newList.length === lastLength) newList.push(department_id);

        user.subscriptionList = newList;
        user.save((error, updatedUser) => {
          if (error) reject(error);
          else {
            const userObject = updatedUser.toObject();
            Promise
            .all([getNewUpdateAudio(userObject.subscriptionList), getNewUpdateDiscussion(userObject.subscriptionList)])
            .then(
              result => {
                userObject.subscriptionAudios = result[0];
                userObject.subscriptionDiscussions = result[1];
                console.log("userObject:", userObject);
                resolve(userObject);
              },
              error => {reject(error);}
            );
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
  userSubscribe,
};
