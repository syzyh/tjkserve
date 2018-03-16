const path = require('path');
const multer = require('multer');
// const upload = multer({ dest: 'public/uploads/'});
const {apiUrl} = require('../../../../config/serverConfig');
const mediaPath = '/serve/public/uploads/';

const { createMedia, getAllMedia, deleteMediaById, reNameMediaById, swapMediaGroup } = require('./controller');

const mediaAPI = (app) => {
  const uploadDir = path.resolve('./public/uploads');

  app.post(apiUrl+'/media/upload', (req, res, next) => {
    console.log('upload');
    let { groupId, type } = req.body;

    console.log(type);
    req.file('media').upload({
      dirname: uploadDir,
      maxBytes: 8589934592
    },
    (err, files) => {
      if (err) return res.status(500).send(err);
      console.log(files[0]);
      if (files[0].type.slice(0,5) === 'image') 
        type = 'picture';
      const url = mediaPath + files[0].fd.split('/').pop();
      createMedia(groupId, files[0].filename, url, files[0].fd, type, files[0].type).then(
        result => {res.send(result);},
        error => {res.send(error);}
      );
    });
  });

  app.get(apiUrl+'/media', (req, res) => {
    const { groupId, type } = req.query;
    getAllMedia(groupId, type).then(
      result => {res.send(result);},
      error => {res.send(error);}
    );
  });

  app.delete(apiUrl+'/media', (req, res) => {
    const { id } = req.query;
    deleteMediaById(id).then(
      result => {res.send(result);},
      error => {res.send(error);}
    );
  });

  app.put(apiUrl+'/media', (req, res) => {
    const { id, name, groupId } = req.body;
    if (id && name) {
      reNameMediaById(id, name).then(
        result => {res.send(result);},
        error => {res.send(error);}
      )
    }
    if (id && groupId) {
      swapMediaGroup(id, groupId).then(
        result => {res.send(result);},
        error => {res.send(error);}
      )
    }
  })
};

module.exports = mediaAPI;