var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db;
if(!db){
  MongoClient.connect("mongodb://localhost:27017/todo", function (err, connection) {
    console.log('connected to mongodb');
    db = connection;
  });
}
module.exports = {
  find:function(collection, dbQuery, options, projection){
    dbQuery = dbQuery || {};
    projection = projection || {};
    options = options || {};
    return new Promise(function (fulfill, reject){
      db.collection(collection).find(dbQuery, projection, options).toArray(function(err, data){
        if (err) reject(err);
        else fulfill(data);
      });
    });
  },
  findOne:function(collection, dbQuery, options, projection){
    dbQuery = dbQuery || {};
    projection = projection || {};
    options = options || {};
    return new Promise(function (fulfill, reject){
      db.collection(collection).findOne(dbQuery, projection, options, function(err, data){
        if (err) reject(err);
        else fulfill(data);
      });
    });
  },
  insert:function(collection, document, options){
    document = document || {};
    options = options || {};
    return new Promise(function (fulfill, reject){
      db.collection(collection).insert(document, options, function(err, result){
        if (err) reject(err);
        else fulfill(result.ops);
      });
    });
  },
  update:function(collection, dbQuery, update, options){
    dbQuery = dbQuery || {};
    update = update || {};
    options = options || {};
    return new Promise(function (fulfill, reject){
      db.collection(collection).update(dbQuery, update, options, function(err, result){
        if (err) reject(err);
        else fulfill(result);
      });
    });
  },
  remove:function(collection, dbQuery, options){
    dbQuery = dbQuery || {};
    options = options || {};
    return new Promise(function (fulfill, reject){
      db.collection(collection).remove(dbQuery, options, function(err, result){
        if (err) reject(err);
        else fulfill(result);
      });
    });
  },
  count:function(collection, dbQuery, options){
    dbQuery = dbQuery || {};
    options = options || {};
    return new Promise(function (fulfill, reject){
      db.collection(collection).count(dbQuery, options, function(err, result){
        if (err) reject(err);
        else fulfill(result);
      });
    });
  },
  distinct:function(collection, dbQuery, options){
    dbQuery = dbQuery || {};
    options = options || {};
    return new Promise(function (fulfill, reject){
      db.collection(collection).distinct(dbQuery, options).toArray(function(err, data){
        if (err) reject(err);
        else fulfill(data);
      });
    });
  }
};
