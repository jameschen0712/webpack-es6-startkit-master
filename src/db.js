const objectAssign = require('object-assign');
var pg = require('pg');
const { array } = require('yargs');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//var $ = require( "jquery" );
//var fetch = require("node-fetch");
// 資料庫配置
var config = {
  user: "postgres",
  database: "test",
  password: "xp22710249",
  port: 5432,
  // 擴充套件屬性
  max: 20, // 連線池最大連線數
  idleTimeoutMillis: 3000, // 連線最大空閒時間 3s
}
// 建立連線池
var pool = new pg.Pool(config);
/*
// 查詢
pool.connect(function (err, client, done) {
  if (err) {
    return console.error('資料庫連線出錯', err);
  }
  // 簡單輸出個 Hello World
  client.query('SELECT $1::varchar AS OUT', ["Hello World"], function (err, result) {
    done();// 釋放連線（將其返回給連線池）
    if (err) {
      return console.error('查詢出錯', err);
    }
    console.log(result.rows[0].out); //output: Hello World
  });
});
*/
// Async & Await 方式（需 node ^7.2.1，執行時使用 node --harmony-async-await index.js）
var col = ['"COUNTYID"','"NAME_1984"','"NAME_1984_ALIAS"','"NAME_2010"','"NAME_2010_ALIAS"','"NAME_2014"','"NAME_2014_ALIAS"','"ISO3166"','"SEGIS_COUNTY_ID"','"AREA_ID"','"_id"','"geojson"'];
var val = ['\'9009\'','\'連江縣\'','\'\'','\'連江縣\'','\'\'','\'連江縣\'','\'\'','\'LJF\'','\'9007\'','\'Z\'','\'18744625\'','\'{type: LineString,coordinates: [[121.56351685523987,25.03585799721269],[121.56548023223877,25.0358093932627]]}\''];
var val2 = ['\'10004\',\'新竹縣\',\'\',\'新竹縣\',\'\',\'新竹縣\',\'\',\'HSQ\',\'10004\',\'J\',\'18744628\',\'{type: LineString,coordinates: [[121.56351685523987,25.03585799721269],[121.56548023223877,25.0358093932627]]}\''];
//console.log(col.join());
//console.log(val.join());
var sql = "INSERT INTO "+config.database+"("+col.join()+") VALUES("+val.join()+"),("+val2.join()+")";
//console.log(sql);

function InsertDB(value, length, tableName){
  var query = async () => {
    // 同步建立連線
    var connect = await pool.connect()
    try {
      // 同步等待結果
        //var res = await connect.query('INSERT INTO test(COUNTYID, NAME_1984, NAME_1984_ALIAS) VALUES(572,\'tester2\',\'info2\')')
        var res = await connect.query(sql);
        //console.log(res.rows) // 可以通過rows遍歷資料
    } finally {
      connect.release()
    }
  }
  // 非同步進行資料庫處理
  query().catch(e => console.error(e.message, e.stack));
}


function queryDB(sqlcmd,search_col,href){
  var query = async () => {
    // 同步建立連線
    var connect = await pool.connect();
    var data = new Object();
    console.log("sqlcmd = "+sqlcmd);
    try {
      // 同步等待結果
        var res = await connect.query(sqlcmd);
        if(search_col === "all")
        {
          data = {
            "type": "FeatureCollection",
            "features": []
          }
          console.log("properties = "+JSON.stringify(data.features));
        }
        console.log("res.rows.length = "+res.rows.length) // 可以通過rows遍歷資料
        for(var i = 0 ; i < res.rows.length ; i++)
        {
          if(search_col === "residence_dist")
          {
            if(i !== 0)
              data.data += ","+res.rows[i].residence_dist;
            else
              data.data = "全部,"+res.rows[i].residence_dist;
          }
          else if(search_col === "code1")
          {
            if(i !== 0)
              data.data += ","+res.rows[i].code1;
            else
              data.data = res.rows[i].code1;
          }
          else if(search_col === "all")
          {
            let newFeature = new Object();
            newFeature.type = "Feature";
            newFeature.properties = new Object();
            newFeature.properties.CODE1 = res.rows[i].CODE1;
            newFeature.properties.TOWN = res.rows[i].TOWN;
            newFeature.properties.VILLAGE = res.rows[i].VILLAGE;
            newFeature.properties.sick_date = res.rows[i].sick_date;
            newFeature.properties.sick_date_last = res.rows[i].sick_date_last;
            newFeature.properties.COUNT = res.rows[i].COUNT;
            newFeature.properties.lat = res.rows[i].lat;
            newFeature.properties.lon = res.rows[i].lon;
            newFeature.geometry = res.rows[i].geometry;
            //let arr = JSON.stringify(res.rows[i]).replaceAll("\\","").split(',\"geometry\":');
            //newFeature.properties = arr[0].replaceAll("\"","'")+"}";
            //newFeature.geometry = arr[1].replaceAll("\"","'");
            //console.log("newFeature.properties = "+JSON.stringify(newFeature.properties));
            //console.log("newFeature.geometry = "+JSON.stringify(newFeature.geometry));
            //newFeature.geometry = "test";
            //console.log("newFeature ="+JSON.stringify(newFeature));
            data.features[i] = newFeature;
            console.log("data = "+JSON.stringify(data));
          }
        }
        //console.log("data.data = "+JSON.stringify(data).replaceAll("\\",""));
    } finally {
      connect.release()
      //AJAX請求
      var request = new XMLHttpRequest();   
      let path = "http://"+href+"/post";
      console.log("path = "+path);
      request.open('POST', path, true);
      request.setRequestHeader('Content-Type', 'application/json')
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {

          // Success!
          console.log("Success! = "+request.responseText);
        }
      };
      //console.log("before encode = "+data);
      request.send(JSON.stringify({Rdata:data}));
      //console.log("after encode = "+"data="+JSON.stringify(data));
    }
  }
  // 非同步進行資料庫處理
  query().catch(e => console.error(e.message, e.stack));
}

module.exports = {
  InsertDB,
  queryDB
}