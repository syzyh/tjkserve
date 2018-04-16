// controllers
const createAudio = require('./controller').createAudio;
const deleteAudio = require('./controller').deleteAudio;
const updateAudio = require('./controller').updateAudio;
const getAudioById = require('./controller').getAudioById;
const getAllAudios = require('./controller').getAllAudios;
const {apiUrl} = require('../../../config/serverConfig');

/**
 * opinion apis
 */
const audioAPI = (app) => {
  console.log('audio:', apiUrl);
  app.get(apiUrl+'/audio', (req, res) => {
    const { branch_name, id } = req.query;
    if (id) {
      getAudioById(id).then(
        (result) => { res.send(result); },
        (error) => { res.send({error: '获取音频失败'}); }
      )
    } else {
      getAllAudios().then(
        (result) => { res.send(result); },
        (error) => { res.send({error: '获取音频失败'}); }
      )
    }
  });

  // create an opinion
  app.post(apiUrl+'/audio', (req, res) => {
    console.log(req.body);
    const {department_id, name, description,url, imgUrl, order, type} = req.body;
    createAudio(department_id, name, description,url, imgUrl, order, type).then(
      result => { res.send({audio: result}); },
      error => { res.send({error: '创建音频失败'})}
    )
  });

  app.put(apiUrl+'/audio', (req, res) => {
    const { id, name, url, imgUrl, description, order } = req.body;
    updateAudio(id, name, url, imgUrl, description, order).then(
      result => {res.send({audio: result});},
      err => {res.send({error: '更新音频失败'});}
    );
  });

  // remove an opinion
  app.delete(apiUrl+'/audio', (req, res) => {
      deleteAudio(req.query.id).then(
        (result) => { res.send({ deleted: true }); },
        (error) => { res.send({ error: '删除音频失败' }); }
      );
  });
};

module.exports = audioAPI;
