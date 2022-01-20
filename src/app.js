var http = require('http');  //含入http模組
var server = http.createServer(function (req, res) {  //建立伺服器
    res.end("This is my first node.js program.");
});
server.listen(3000);  //「3000」是埠號,使用者可自修改
console.log("listeming at http://localhost:3000");
//var pg = require('pg');
console.log("loaded pg");
