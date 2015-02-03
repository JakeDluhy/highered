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

app.set('port', process.env.PORT || 8080);

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

mongoose.connect('mongodb://104.130.6.163:27017');
mongoose.connection.on('open', function() {
    console.log('Connected to Mongoose...');
});

routes.initialize(app);

http.createServer(app).listen(app.get('port'), '10.208.232.70', function() {
  console.log('Server up http://10.208.232.70:' + app.get('port'));
});

