const path = require('path');

const serverConfigs = {
  PORT: 4000,
  ROOT: path.resolve(__dirname, '..'),
  DBURL: 'mongodb://localhost:27017/ant'
}

module.exports = serverConfigs;