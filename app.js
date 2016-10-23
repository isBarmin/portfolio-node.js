'use strict';

let fs         = require('fs');
let path       = require('path');
let mongoodb   = require('./models/mongoodb');
let bodyParser = require('body-parser');
let express    = require('express');
let app        = express();
let session    = require('express-session');
let MongoStore = require('connect-mongo')(session);
let config     = require('./config/config.json');

// Отключаем информацию о сервере в заголовках ответа
app.disable('x-powered-by');

require('./models/user');

app.use(session({
  secret: 'loftschool',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection:mongoodb.connection})
}));


// view engine setup
app.set('view engine', 'pug');


// Устанавливаем папку со статикой
app.use(express.static(path.resolve( config.http.publicRoot )));

app.use(bodyParser.json());



// Routes
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/admin', require('./routes/admin/middleware'));
app.use('/admin', require('./routes/admin/index'));
app.use('/',      require('./routes/frontend'));
app.use('/mail',  require('./routes/sendmail'));



//Пользовательская страница 404
app.use(function(req, res, next) {
  res.type('text/plain');
  res.status(404);
  res.send('404! Page not found');
});


//Пользовательская страница 500
app.use(function(err, req ,res, next) {
  console.error( err.stack );
  res.type('text/plain');
  res.status(500);
  res.send('500 - ошибка сервера');
});



app.set('port', process.env.PORT || config.http.port);

app.listen(app.get('port'), config.http.host, function() {
  var uploadDir = path.resolve(config.http.publicRoot, 'upload');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  console.log(`Server is up on ${config.http.host}:${app.get('port')} ...`);
});



module.exports = app;