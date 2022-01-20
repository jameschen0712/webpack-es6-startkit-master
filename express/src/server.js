const express = require('express');
const cors = require('cors');
const db = require('../../src/db.js');
const fs = require('fs');
const bodyParser = require('body-parser');
const url = require('url');
const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '5000mb'}));
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true}));
app.use(bodyParser.json());

var distData;
var _target;
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); 
    res.header('X-Powered-By', 'nodejs'); 
    res.header('Content-Type', 'application/json;charset=utf-8'); 
    next();
 });
 app.get('/',function (req,res) {
     //if(req.url!=="/favicon.ico")
     res.writeHead(200,{"Content-Type":"text/html"});
     res.end(fs.readFileSync("../../index.html"));
 });

app.get('/searchCity', (req, res) => {
    var params = url.parse(req.url, true).query; //parse將字串轉成物件,req.url="/?url=123&name=321"，true表示params是{url:"123",name:"321"}，false表示params是url=123&name=321
    let city = params.city;
    let dist = params.dist;
    let code = params.code;
    let result;
    console.log("city = "+city);
    console.log("dist = "+dist);
    console.log("code = "+code);
    let dbName = "dengue_cluster_info",sql;
    //console.log("reqreqreq = "+req.get('host'));
    //獲取客戶端IP
    //let href = req.socket.remoteAddress.split('::ffff:')[1];
    let href = req.get('host');
    if(code !== undefined)
    {
        //console.log("new data = '"+code.replaceAll(",","','")+"'");
        let str = "'"+code.replaceAll(",","','")+"'";
        sql = 'SELECT code1 AS "CODE1",residence_dist AS "TOWN",residence_village AS "VILLAGE",'
        +'to_char(sickdate_first, \'yyyymmdd\') AS "sick_date",to_char(sickdate_last, \'yyyymmdd\') AS "sick_date_last",'
        +'case_count AS "COUNT",lat,lon,"GeoJSON" AS geometry FROM '+dbName+' WHERE code1 in ('+str+')';
        result = db.queryDB(sql,"all",href);
    }
    else if(dist === undefined)
    {
        sql = "SELECT DISTINCT residence_dist FROM "+dbName+" WHERE residence_city = '"+city+"'";
        result = db.queryDB(sql,"residence_dist",href);
    }
    else
    {
        if(dist === "全部")
            sql = "SELECT DISTINCT code1 FROM "+dbName+" WHERE residence_city = '"+city+"'";
        else
            sql = "SELECT DISTINCT code1 FROM "+dbName+" WHERE residence_city = '"+city+"' AND residence_dist = '"+dist+"'";
        result = db.queryDB(sql,"code1",href);
    }
    console.log("sql = "+sql);
    //console.log("result = "+result);
    _target = new EventTarget();
    _target.addEventListener('test',()=>{res.json(distData);_target.removeEventListener('test');});
    });

app.post('/post', function(req, res) {
    console.log("POST=============================================================");
    if(req.body.Rdata.features !== undefined)
    {
        distData = req.body.Rdata;
        console.log("req.body.Rdata = "+JSON.stringify(req.body.Rdata));
    }
    else
    {
        distData = req.body.Rdata.data;
        //console.log("req.body.Rdata.data = "+req.body.Rdata.data);
    }
    let event = new Event("test");
    _target.dispatchEvent(event);
    //for (const key in req) {
    //  console.log(req[key]); // Danny 、 26 、 180 、 72
    //  }
    let city = req.params.city;
    let dbName = "dengue_cluster_info";
    //let method = city.split('-')[0];
    //let context = city.split('-')[1];
    //console.log("method = "+method);
    //if(method === 'dbResult'){
        //console.log("result = "+method);
        //res.json({
        //    message: "查詢結果: "
        //});
    //}
});
app.listen(2020, () => {
    console.log('server is listening on port 2020');
});