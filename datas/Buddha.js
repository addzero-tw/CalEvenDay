var parse = require('csv-parse');
const fs = require('fs');
require('should');
var sqlite3 = require("sqlite3").verbose();

var inputFile='./data/name_list.csv';


exports.QueryName = function(Name,cb) {
    if (typeof cb !== 'function') {
        throw new Error('need a callback');
    }
	
	var parser = parse({delimiter: ','}, function (err, data) {
		//console.log(Name);
		var result = new Array();
		for(var i=1;i<data.length;i++){
			var onevals = data[i];
			//console.log(onevals[1]);
			if(onevals[1].indexOf(Name) > -1) {
				result.push({ID:onevals[0],Name:onevals[1],Note:onevals[2]});
			}
			if(result.length == 10)break;
		}
		cb(err, result);
	});
	fs.createReadStream(inputFile).pipe(parser);
}
exports.QueryID = function(ID,cb) {
    if (typeof cb !== 'function') {
        throw new Error('need a callback');
    }
	
	var parser = parse({delimiter: ','}, function (err, data) {
		//console.log(Name);
		var result = new Array();
		for(var i=1;i<data.length;i++){
			var onevals = data[i];
			//console.log(onevals[1]);
			if(onevals[0].indexOf(ID) == 0) {
				result.push({ID:onevals[0],Name:onevals[1],Note:onevals[2]});
			}
			if(result.length == 10)break;
		}
		cb(err, result);
	});
	fs.createReadStream(inputFile).pipe(parser);
}
exports.CommitCount = function(ID,Count,cb) {
	if (typeof cb !== 'function') {
		throw new Error('need a callback');
	}
	var Now = new Date();
	Now.setHours(Now.getHours() - 17);
	var SqliteFileStr = Now.getFullYear().toString() + (Now.getMonth()+1).toString();
	var DateStr = Now.getFullYear().toString()+"-"+(Now.getMonth()+1).toString()+"-"+Now.getDate();
	
	var file = "./data/"+SqliteFileStr+".sqlite";
	var exists = fs.existsSync(file);
	if(!exists) {
		console.log("Creating DB file.");
		fs.openSync(file, "w");
	}
	var db = new sqlite3.Database(file);
	db.serialize(function() {
		if(!exists) {
			db.run("CREATE TABLE IF NOT EXISTS BuddhaCount (UserId Integer ,Kind Integer, Date char(10), Count Integer,PRIMARY KEY (UserId, Kind,Date));");
			db.run("INSERT OR IGNORE INTO BuddhaCount(UserId,Kind,Date,Count) Values(?,?,?,?)",ID,1,DateStr,Count);
			//db.get("SELECT Count FROM BuddhaCount where UserId = ? and Kind = ? and Date = ?",[ID,1,DateStr], function(err, row){
				//res.json({ "count" : row.value });
				
			//});
			
			db.close();
		}
	})
	cb(err, {result:'success'});
}