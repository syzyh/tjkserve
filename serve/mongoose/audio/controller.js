const Audio = require('./model');
const Department = require('../department/model');

const getAudios = (branch_name) => {
  if (branch_name) {
    console.log(branch_name);
    return new Promise((resolve, reject) => {
      Department
      .findOne({department_urlName: branch_name})
      .exec((error, department) => {
        if (error) reject(error);
        Audio
        .find({department_id : department._id})
        .sort({ audio_order: -1 })
        .exec((error, audios) => {
          if (error) reject(error);
          else resolve(audios);
        })
      });
    })
  }
  return Audio.find().exec();
};

const deleteAudio = _id => {
  return Audio.remove({_id}).exec();
};

const createAudio = (department_id, audio_name, audio_description, audio_url, audio_imgUrl, audio_order, type) => {
  return new Promise((resolve, reject) => {
    const newAudio = new Audio({
      department_id,
      type,
      audio_name,
      audio_description,
      audio_url,
      audio_imgUrl,
      audio_order,
      audio_like: 0,
      audio_skim: 0,
      created_date: new Date(Date.now() + (8 * 60 * 60 * 1000)),
    })
    console.log(newAudio);
    newAudio.save((err, result) => {
      if (err) {console.log(err); reject({error: err});}
      else {resolve(result._doc);}
    });
  });
};

const updateAudio = (id, audio_name, audio_url, audio_imgUrl, audio_description, audio_order) => {
  return Audio.findByIdAndUpdate(id, {audio_name, audio_url, audio_imgUrl, audio_description, audio_order}).exec();
};

module.exports = {
  getAudios,
  deleteAudio,
  createAudio,
  updateAudio
}