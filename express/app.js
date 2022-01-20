var express = require('express');
var fs = require('fs');
var http = require('http');
var app = express();
var path = require('path');
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(express.static('files'));
app.use(bodyParser.json({limit: '5000mb'}));
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true}));
app.all('*', (req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*'); 
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); 
   res.header('X-Powered-By', 'nodejs'); 
   res.header('Content-Type', 'application/json;charset=utf-8'); 
   next();
});
app.get('/',function (req,res) {
    if(req.url!=="/favicon.ico")
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end(fs.readFileSync("../index.html"));
});
app.listen(3001);
console.log("server listen at 3001");