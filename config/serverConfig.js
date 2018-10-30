const path = require('path');

const serverConfigs = {
  PORT: 4000,
  ROOT: path.resolve(__dirname, '..'),
  SESSION: {
    secret: 'ant',
    key: 'ant',
    maxAge: 2592000000
  },
  DBURL: 'mongodb://antDaiye:ant19950601@www.daiye.org:27017/ant?authSource=admin&authMechanism=SCRAM-SHA-1',
  apiUrl: '/api',
  secret: "966a2c45030de77fceae260153cceef6",
}

module.exports = serverConfigs;