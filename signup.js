var db = require('./dbQueries.js');
var crypto = require('crypto');
var parse = require('co-body');
var Router = require('koa-router');
var router = new Router();
var views = require('co-views');
var render = views(__dirname + './views', { ext: "ejs" });

router.post('/signup', function *() {
  var postdata = yield parse(this);
  var result = yield signup(postdata);
  if(result.error){
    this.body = result.error;
  } else if(result.result){
    this.body = "Signed up successfully. You can now login";
    // login and redirect
  } else{
    this.body = "some error occured during signup";
  }
});

module.exports = {router:router};

var generateHash = function(password){
  if (!password) {
    return {error:"No password supplied."};
  }else{
    var encrypred,
      salt = Math.round((new Date().valueOf() * Math.random())) + '';
    try {
      encrypred = crypto.createHmac('sha1', salt).update(password).digest('hex');
    } catch (err) {
      return {error:err};
    }
    return {hash:encrypred, salt:salt};
  }
};

function signup(details) {
  return function* (next){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(details.email)){
      return {error:'Email is not valid'};
    } else{
      var searchIfExists = yield db.count('users', {email:details.email});
      if(searchIfExists){
        return {error:'User with provided email already exists'};
      }else{
          var encPassword = generateHash(details.password);
          if(encPassword.error){
            console.log(encPassword.error);
            return {error:encPassword};
          }else{
            var result = yield db.insert('users', {
              "email":details.email,
              "hash":encPassword.hash,
              "salt":encPassword.salt,
              "first name":details.firstName,
              "last name":details.lastName,
            });
            console.log(result);
            return {result:result};
          }
      }
    }
  };
}
