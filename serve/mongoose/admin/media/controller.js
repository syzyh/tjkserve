const Media = require('./model');
const fs = require('fs');
const path = require('path');

const createMedia = (groupId, name, url, localUrl, type, detailType) => {
  return new Promise((resolve, reject) => {
    const mediaObject = { name, url, localUrl, type, detailType };
    if (groupId && groupId !== 'undefined' && groupId !== '0' && groupId !== '1') mediaObject.groupId = groupId;

    console.log(mediaObject);
    const newMedia = new Media(mediaObject);
    newMedia.save((error) => {
      if (error) { console.log(error); reject({ create: false }); }
      else { resolve(Object.assign({}, newMedia, { created: true })); }
    });
  });
};

const getAllMedia = (groupId, type)  => {
  const findObject = {};
  if (groupId) findObject.groupId = groupId;
  if(type) findObject.type = type;

  return new Promise((resolve, reject) => {
    Media
    .find(findObject)
    .exec((error, results) => {
      if (error) {console.log(error);reject(error);}
      else { resolve(results); }
    });
  });
};

const deleteMediaById = mediaId => {
  return new Promise((resolve, reject) => {
    Media
    .findByIdAndRemove(mediaId)
    .exec((error, result) => {
      if (error) reject(error);
      else {
        if (result.localUrl)
          fs.unlink(result.localUrl, () => {resolve({deleted: true});});
      }
    })
  });
};

const reNameMediaById = (id, name) => {
  return new Promise((resolve, reject) => {
    Media
    .update({_id: id}, {name})
    .exec(error => {
      if (error) reject(error);
      else resolve({renamed: true})
    })
  });
};

const swapMediaGroup = (mediaId, groupId) => {
    return new Promise((resolve, reject) => {
      Media
      .update({_id: mediaId}, {groupId})
      .exec(error => {
        if (error) reject(error);
        else resolve({swaped: true});
      })
    });
}

module.exports = {
  createMedia,
  getAllMedia,
  deleteMediaById,
  reNameMediaById,
  swapMediaGroup,
};
