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
	var db = new sqlite3.Database(UserListFile);
	var result = new Array();
	db.serialize(function() {
		
		db.each("Select ID,Name,Note from UserList where Name like '"+Name+"%' limit 10"
			, function(err, row){
				//console.log(row);
				result.push({ID:row.ID,Name:row.Name,Note:row.Note});
			}
			,function() {
				cb(undefined,result);
				db.close();
		});
	});
}
exports.QueryID = function(ID,cb) {
    if (typeof cb !== 'function') {
        throw new Error('need a callback');
    }
	var db = new sqlite3.Database(UserListFile);
	var result = new Array();
	db.serialize(function() {
		db.each("Select ID,Name,Note from UserList where cast(ID as char(10)) like '"+ID+"%' limit 10"
			, function(err, row){
				//console.log(row);
				result.push({ID:row.ID,Name:row.Name,Note:row.Note});
			}
			,function() {
				cb(undefined,result);
				db.close();
			});
		
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
		UserListDb.each("Select ID,Name from UserList where ID = "+ID+" limit 1"
			, function(err, row){
				InsertID = row.ID;
				InsertName = row.Name;
			}
			, function() {
				UserListDb.close();
				if(InsertID == undefined) {
					console.log("Not Found Fail")
					cb(undefined, {result:'Fail'});
					return;
				}
				WriteCountToDb(InsertID,InsertName,Count,cb);
			});
		
	});
	
	
}
function WriteCountToDb(ID,Name,Count,cb) {
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
			db.run("Insert or ignore into BuddhaCount(UserId,Name,Kind,Date,Count) Values(?,?,?,?,?); ",ID,Name,1,DateStr,Count);
			cb(undefined, {result:'Success'});
			db.close();
		}
	});
}