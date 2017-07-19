const morgan = require('morgan');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const expressConfig = (app, serverConfigs) => {
  app.use(compress());

  app.use(morgan('dev'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser());

  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secret',
    store: new mongoStore({
      url: serverConfigs.DBURL,
      collection : 'sessions',
    }),
  }));

  app.use(flash());
  
  require('./routes')(app);
};

module.exports = expressConfig;