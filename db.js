/*
const { Client } = require('pg')
const client = new Client(
  {
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'xp22710249',
    port: 5432,
  }
)
client.connect()
var values = [
  [571,"tester1","info1"],
  [572,"tester2","info2"]
];
client.query("INSERT INTO company(id, name, info) VALUES (572, 'tester2', 'info2')").then(() => {
    console.log("INSERT SUCCESS");
});
client.release()
*/
<script src="../node_modules/pg"></script>
//var pg = require('node_modules/pg');
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

function queryDB(sqlcmd){
  var query = async () => {
    // 同步建立連線
    var connect = await pool.connect()
    try {
      // 同步等待結果
        //var res = await connect.query('INSERT INTO test(COUNTYID, NAME_1984, NAME_1984_ALIAS) VALUES(572,\'tester2\',\'info2\')')
        var res = await connect.query(sqlcmd);
        //console.log(res.rows) // 可以通過rows遍歷資料
    } finally {
      return res.rows;
      connect.release()
    }
  }
  // 非同步進行資料庫處理
  query().catch(e => console.error(e.message, e.stack));
}

//InsertDB();
module.exports = {
  InsertDB,
  queryDB
}

/*
var mysql = require('mysql');

// 資料庫信息
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : '資料庫用戶名',
    password : '資料庫登錄密碼',
    database : '操作資料庫名'
});
var values = [
    ["index","www.alibaba.com",1,0],
    ["index1","www.google.com",1,0]
];
var sql = "INSERT INTO url(`from`,`to`,`status`, `is_new`) VALUES ?";
connection.query(sql, [values], function (err, rows, fields) {
    if(err){
                console.log('INSERT ERROR - ', err.message);
                return;
            }
            console.log("INSERT SUCCESS");
});
*/