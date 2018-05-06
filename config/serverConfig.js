const path = require('path');

const serverConfigs = {
  PORT: 4000,
  ROOT: path.resolve(__dirname, '..'),
  SESSION: {
    secret: 'ant',
    key: 'ant',
    maxAge: 2592000000
  },
  DBURL: 'mongodb://www.daiye.org:27017/ant',
  apiUrl: '/api',
  secret: "966a2c45030de77fceae260153cceef6",
}

module.exports = serverConfigs;