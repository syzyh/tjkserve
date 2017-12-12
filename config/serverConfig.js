const path = require('path');

const serverConfigs = {
  PORT: 4000,
  ROOT: path.resolve(__dirname, '..'),
  SESSION: {
    secret: 'ant',
    key: 'ant',
    maxAge: 2592000000
  },
  DBURL: 'mongodb://localhost:27017/ant'
}

module.exports = serverConfigs;