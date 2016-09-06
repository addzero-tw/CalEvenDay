//var parse = require('csv-parse');
const fs = require('fs');
require('should');
var sqlite3 = require("sqlite3").verbose();
var UserListFile = './data/name_list.sqlite';
//var inputFile='./data/name_list.csv';


exports.QueryName = function(Name,cb) {
    if (typeof cb !== 'function') {
        throw new Error('need a callback');
    }
	/*
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
	*/
	var db = new sqlite3.Database(UserListFile);
	db.serialize(function() {
		var result = new Array();
		db.each("Select ID,Name,Note from UserList where Name like '"+Name+"%' limit 10"
			, function(err, row){
				result.push({ID:row[0],Name:row[1],Note:row[2]});
			});
		cb(undefined,result);
		db.close();
	});
}
exports.QueryID = function(ID,cb) {
    if (typeof cb !== 'function') {
        throw new Error('need a callback');
    }
	var db = new sqlite3.Database(UserListFile);
	db.serialize(function() {
		var result = new Array();
		db.each("Select ID,Name,Note from UserList where cast(ID as char(10)) like '"+ID+"%' limit 10"
			, function(err, row){
				console.log(row);
				result.push({ID:row[0],Name:row[1],Note:row[2]});
			});
		cb(undefined,result);
		db.close();
	});
}
exports.CommitCount = function(ID,Name,Count,cb) {
	if (typeof cb !== 'function') {
		throw new Error('need a callback');
	}
	var InsertID = undefined;
	var InsertName = undefined;
	var UserListDb = new sqlite3.Database(UserListFile);
	UserListDb.serialize(function() {
		var result = new Array();
		UserListDb.each("Select ID,Name from UserList where ID = "+ID+" limit 1"
			, function(err, row){
				InsertID = row[0];
				InsertName = row[1]
			});
		UserListDb.close();
	});
	if(InsertID == undefined) {
		cb(err, {result:'Fail'});
		return;
	}
	var Now = new Date();
	Now.setHours(Now.getHours() - 17);
	var SqliteFileStr = Now.getFullYear().toString() + (Now.getMonth() <9 ? ('0'+(Now.getMonth()+1)):(Now.getMonth()+1).toString());
	var DateStr = Now.getFullYear().toString()
			+"-"+(Now.getMonth() < 9 ? ('0'+(Now.getMonth()+1)):(Now.getMonth()+1).toString())
			+"-"+(Now.getDate() < 9 ? ('0'+(Now.getDate()+1)):(Now.getDate()+1).toString());
	
	var file = "./data/"+SqliteFileStr+".sqlite";
	var exists = fs.existsSync(file);
	if(!exists) {
		console.log("Creating DB file.");
		fs.openSync(file, "w");
	}
	var db = new sqlite3.Database(file);
	db.serialize(function() {
		if(!exists) {
			//db.run("CREATE TABLE IF NOT EXISTS BuddhaCount (UserId Integer ,Kind Integer, Date char(10), Count Integer,PRIMARY KEY (UserId, Kind,Date));");
			db.run("CREATE TABLE IF NOT EXISTS BuddhaCount (UserId Integer,Name TEXT,Kind Integer,Date TEXT,Count Integer,PRIMARY KEY(UserId,Kind,Date));");
			//db.run("INSERT OR IGNORE INTO BuddhaCount(UserId,Kind,Date,Count) Values(?,?,?,?)",ID,1,DateStr,Count);
			//db.get("SELECT Count FROM BuddhaCount where UserId = ? and Kind = ? and Date = ?",[ID,1,DateStr], function(err, row){
				//res.json({ "count" : row.value });
				
			//});
			db.run("Insert or ignore into BuddhaCount(UserId,Name,Kind,Date,Count) Values(?,?,?,?,?); ",InsertID,InsertName,1,DateStr,Count);
			cb(undefined, {result:'Success'});
			db.close();
		}
	})
	cb(err, {result:'Fail'});
}