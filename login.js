var db = require('./dbQueries.js');
var crypto = require('crypto');
var passport = require('koa-passport');
var co = require('co');
var parse = require('co-body');
var parser = function *parser( next) {
  this.req.body = yield parse(this);
  yield next;
};

var Router = require('koa-router');
var router = new Router();
var views = require('co-views');
var render = views(__dirname + './views', { ext: "ejs" });


router.post('/login', parser, function*(next){
  if(this.req.isAuthenticated()) this.body = "Already logged in";
  else {
    var ctx = this;
    yield passport.authenticate('local-signin', function*(err, user, info){
      if (err){
        console.log(err);
        ctx.status = 500;
        ctx.body = "Some error occured";
      }
      if (user === false) {
        ctx.status = 401;
        ctx.body = "Incorrect email or password";
      } else {
        yield ctx.login(user);
        ctx.body = "logged in successfully";
      }
    }).call(this, next);
  }

});


router.get('/logout', function*() {
  this.req.logout();
  this.body = 'logged out successfully';
});

module.exports = {router:router};

var generateHash = function(password, cb) {
  if (!password) {
    return cb('');
  }
  var encrypred,
  salt = Math.round((new Date().valueOf() * Math.random())) + '';
  try {
    encrypred = crypto.createHmac('sha1', salt).update(password).digest('hex');
    return cb(null, encrypred, salt);
  } catch (err) {
    return cb(err);
  }
};

var authenticator = function(user_pass, supplied_pass, salt, cb) {
  if (!supplied_pass) return cb(new Error("No password was supplied"));
  else {
    if (crypto.createHmac('sha1', salt).update(supplied_pass).digest('hex') == user_pass) return cb(null, true);
    else return cb(null, false);
  }
};


passport.serializeUser(function(user, done) {
  done(null, user._id);
});


passport.deserializeUser(function(id, done) {
  co(function* (){
    var user = yield db.findOne('users', {_id:id}, {fields:{"first name":1, "email":1}});
    if(user.email){
      done(null,user);
    }else{
      console.log('user not found');
      return done(null, null);
    }
  });
});



var LocalStrategy = require('passport-local').Strategy;

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email'}, function (email, password, done) {
    co(function* (){
      var user = yield db.findOne('users', {email:email});
      if(user){
         authenticator(user.hash, password, user.salt, function verifyPassword(err, valid) {
          // console.log(valid);
          if (err) {
            console.log("Error:"+err);
            return done(err);
          }else if (!valid) {
            console.log("Not valid password");
            return done(null, false);
          }else{
            done(null, user);
          }
        });
      } else {
        console.log('email is not registered');
        return done(null, false);
      }
    });
  })
);
