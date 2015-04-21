var home = require('./controllers/home'),
    lessons = require('./controllers/lessons'),
    subjects = require('./controllers/subjects'),
    users = require('./controllers/users');

module.exports.initialize = function(app) {
  app.get('/', home.index);
  app.get('/*', home.index);
  app.post('/login', home.login);
  app.post('/signup', home.signup);
  app.post('/session/save', home.saveRemember);
  app.post('/session/check', home.checkRemember);

  app.get('/lessons', lessons.index);
  app.post('/lessons', lessons.create);
  app.get('/lessons/:id', lessons.show);

  app.get('/subjects', subjects.index);
  app.get('/subjects/:id', subjects.show);

  app.get('/users', users.index);
  app.get('/users/:id', users.show);

  

  // app.get('/posts', posts.index);
  // app.get('/posts/:id', posts.getById);
  // app.post('/posts', posts.add);
  // app.put('/posts/:id', posts.update);
  // app.delete('/posts/:id', posts.delete);

  // app.get('/recipes', recipes.index);
  // app.get('/recipes/:id', recipes.getById);
  // app.post('/recipes', recipes.add);
  // app.put('/recipes/:id', recipes.update);
  // app.delete('/recipes/:id', recipes.delete);
}