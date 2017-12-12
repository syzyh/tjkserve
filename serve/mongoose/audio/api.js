// controllers
const getAudios = require('./controller').getAudios;
const createAudio = require('./controller').createAudio;
const deleteAudio = require('./controller').deleteAudio;
const updateAudio = require('./controller').updateAudio;
const apiUrl = '/serve/api';

/**
 * opinion apis
 */
const audioAPI = (app) => {
  app.get(apiUrl+'/audio', (req, res) => {
    const { branch_name } = req.query;
    getAudios(branch_name).then(
      (result) => { res.send(result); },
      (error) => { res.send({error: '获取失败'}); }
    );
  });

  // create an opinion
  app.post(apiUrl+'/audio', (req, res) => {
    console.log(req.body);
    const {department_id, name, description,url, order, type} = req.body;
    createAudio(department_id, name, description,url, order, type).then(
      result => { res.send({audio: result}); },
      error => { res.send({error: '创建音频失败'})}
    )
  });

  app.put(apiUrl+'/audio', (req, res) => {
    const { id, name, url, description, order } = req.body;
    updateAudio(id, name, url, description, order).then(
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