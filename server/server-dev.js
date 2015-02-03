var express = require('express'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path'),
    routes = require('./app/routes'),
    exphbs = require('express-handlebars'),
    mongoose = require('mongoose'),
    app = express();

app.set('port', process.env.PORT || 3300);

app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({
    defaultLayout: 'index',
    layoutsDir: app.get('views') + '/layouts'
}));
app.set('view engine', 'handlebars');

app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser('some-secret-value-here'));
app.use('/', express.static(path.join(__dirname, 'public')));


//development only
if ('development' == app.get('env')) {
  app.use(errorHandler());

  mongoose.connect('mongodb://localhost/HigherEd');
  mongoose.connection.on('open', function() {
    console.log('Connected to Mongoose...');

  });
}


// connect to the db server:


routes.initialize(app);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server up http://localhost:' + app.get('port'));
});

