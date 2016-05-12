var db = require('./dbQueries.js');
var parse = require('co-body');
var ObjectId = require('mongodb').ObjectID;
var Router = require('koa-router');
var router = new Router();
var render = require('co-views')(__dirname + '/views', { ext: "ejs" });

// <a href='localhost:3005/remove-todo/'"+insertTODO._id+"' target='_blank'>cancel</a>
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://todoapp8080@gmail.com:todo8080@smtp.gmail.com');





router.get('/', function* (){
  if(this.req.user){
    var todo = yield db.find('todo', {userId:this.req.user._id});
    this.body = yield render('todo.ejs', {user:ObjectId(this.req.user._id), todo:todo});
  } else {
    this.body = yield render('home.ejs');
  }
});

router.post('/add-todo', function* (){
  if(this.req.user){
    var data = yield parse(this);
    var user = this.req.user;
    var insertTODO = yield db.insert('todo', {title:data.title.toString(), location:data.location.toString(), timestamp:parseInt(data.timestamp, 10), userId:this.req.user._id});
    setTimeout(function(){
      var mailOptions = {
          from: 'TODO APP',
          to: user.email,
          subject: 'TODO notification',
          html: "<!DOCTYPE html><html><head><meta charset='utf-8'><title></title></head><body><a href='http://188.166.218.241:3005/remove-todo/"+insertTODO[0]._id+"' target='_blank'>cancel</a><a href='http://188.166.218.241:3005/postpone-todo/"+insertTODO[0]._id+"' target='_blank'>postpone by 24 hrs</a></body></html>"
      };
      transporter.sendMail(mailOptions);
    }, data.timestamp - Date.now() - 15*60*1000);
    this.body = "TODO added successfully";
  } else {
    this.body = 'user is not logged in.';
  }
});

router.get('/remove-todo/:todoId', function* (){
  if(this.req.user){
    var removeTODO = yield db.remove('todo', {_id:ObjectId(this.params.todoId)});
    this.body = 'TODO removed successfully';
  } else {
    this.body = 'user is not logged in.';
  }
});

router.get('/postpone-todo/:todoId', function* (){
  if(this.req.user){
    var getTODO = yield db.findOne('todo', {_id:ObjectId(this.params.todoId)});
    var updateTODO = yield db.update('todo', {_id:ObjectId(this.params.todoId)}, {$set:{timestamp:getTODO.timestamp+24*60*60*1000}});
    this.body = 'TODO updated successfully';
  } else {
    this.body = 'user is not logged in.';
  }
});

module.exports = {router:router};
