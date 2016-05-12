var db = require('./dbQueries.js');
var logger = require('koa-logger');
var mount = require('koa-mount');
var session = require('koa-generic-session');
var Router = require('koa-router');
var koa = require('koa');
var koaStatic = require('koa-static');
var MongoStore = require('koa-generic-session-mongo');
var passport = require('koa-passport');
var cookie = require('cookie');
var co = require('co');


var app = koa();
app.use(koaStatic(__dirname + "/staticFiles", { maxage: 31536000000 }));
app.use(logger());

app.keys = ['keys', 'keykeys'];
app.use(session({
  store: new MongoStore()
}));

app.use(passport.initialize());
app.use(passport.session());

var render = require('co-views')(__dirname + './views', { ext: "ejs" });

app.use(require('./temporary.js').router.middleware());

app.use(require('./signup.js').router.middleware());

app.use(require('./login.js').router.middleware());

if (!module.parent) {
	app.listen(3005);
	console.log('todo is up and running on port 3005');
}
