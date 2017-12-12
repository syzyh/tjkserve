const morgan = require('morgan');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const skipper = require('skipper')();

const expressConfig = (app, serverConfigs) => {
  app.use(compress());

  app.use(morgan('dev'));

  app.use(skipper);
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser());

  app.use(session({
    name: 'ant',
    resave: true,
    saveUninitialized: false,
    secret: 'secret',
    store: new mongoStore({
      url: serverConfigs.DBURL,
      collection : 'sessions',
    }),
    cookie: {maxAge: 60000000}
  }));

  app.use(flash());
  
  require('./routes')(app);
};

module.exports = expressConfig;