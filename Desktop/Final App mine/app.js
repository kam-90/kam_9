var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

const myCache = require("./helpers/db");

// view engine setup
const PORT = process.env.PORT || 80;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/*
// This part not needed anymore if you share files from same server.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/

app.get('/api/posts', function (req, res) {
  myCache.get("posts", function(err, value){
        if(!err && value !== undefined){
            res.send(value);
        }
        else{
      res.send([]);
    }
  });
});

app.post('/api/posts', function (req, res) {
  myCache.get("posts", function(err, value){
        if(!err && value !== undefined){
      addToCache(value, req.body);
        } else {
      addToCache([], req.body);
    }
  });
  res.send({success: true});
});



function addToCache(currentState, newData) {
  
  currentState.push(newData);
  myCache.set("posts", currentState, function(err, success){
    if( !err && success ){
      console.log("added new post");
    }
  });
}

// Redirect all remaining calls to index.html
// If you access kamblog.com/products - it is not found in public folder. 
// So before Angular takes contol over routing it is undefined for node and result in 404
// Therefore we have to do this redirect.

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// ALL other methods (post, put, delete) with be treated as errors. We have declared accepted routes earlier.
app.all('*', function(req, res){
  res.send('Bad request', 400);
});


module.exports = app;

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});