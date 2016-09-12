//var parse = require('csv-parse');
const fs = require('fs');
require('should');
var sqlite3 = require("sqlite3").verbose();
var UserListFile = './data/name_list.sqlite';


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
			db.run("CREATE TABLE IF NOT EXISTS BuddhaCount (UserId Integer,Name TEXT,Kind Integer,Date TEXT,Count Integer,PRIMARY KEY(UserId,Kind,Date));");
		}
		db.run("Insert or ignore into BuddhaCount(UserId,Name,Kind,Date,Count) Values(?,?,?,?,?); ",ID,Name,1,DateStr,Count);
		cb(undefined, {result:'Success'});
		db.close();
	});
}
exports.YesterdayCountList = function(cb) {
	var Now = new Date();
	Now.setHours(Now.getHours() - 17);
	var SqliteFileStr = Now.getFullYear().toString() + (Now.getMonth() <9 ? ('0'+(Now.getMonth()+1)):(Now.getMonth()+1).toString());
	var DateStr = Now.getFullYear().toString()
			+"-"+(Now.getMonth() < 9 ? ('0'+(Now.getMonth()+1)):(Now.getMonth()+1).toString())
			+"-"+(Now.getDate() < 9 ? ('0'+Now.getDate()):(Now.getDate()).toString());
	var YearStr = Now.getFullYear().toString();
	var MonthStr = (Now.getMonth() < 9 ? ('0'+(Now.getMonth()+1)):(Now.getMonth()+1).toString());
	var DayStr = (Now.getDate() < 9 ? ('0'+Now.getDate()):(Now.getDate()).toString());
	var file = "./data/"+SqliteFileStr+".sqlite";
	var exists = fs.existsSync(file);
	if(!exists) {
		console.log("Creating DB file.");
		fs.openSync(file, "w");
	}
	//console.log("select UserId,Name,Count from BuddhaCount where Date = '"+DateStr+"' and Kind = 1 order by UserId")
	var db = new sqlite3.Database(file);
	db.serialize(function() {
		if(!exists) {
			db.run("CREATE TABLE IF NOT EXISTS BuddhaCount (UserId Integer,Name TEXT,Kind Integer,Date TEXT,Count Integer,PRIMARY KEY(UserId,Kind,Date));");
		}
		result = new Array();
		People = 0;
		SumCount = 0;
		db.each("select UserId,Name,Count from BuddhaCount where Date = ? and Kind = 1 order by UserId",DateStr,function(err,row){
			//result.push({UserId:row.UserId,Name:row.Name,Count:row.Count});
			
			
			result.push('<pre>'+row.UserId+'\t'+row.Name +(row.Name.length <= 2 ? '\t\t':'\t')+FixInteger(row.Count)+'</pre>');
			People +=1;
			SumCount += row.Count;
		}
		,function() {
			result.push('<pre>以上林口極樂虛空念佛堂'+YearStr+'年'+MonthStr+'月'+DayStr+'日</pre>');
			result.push('<pre>念佛總數:\t'+FixInteger(SumCount)+'</pre>');
			result.push('<pre>念佛人數:\t'+FixInteger(People)+'</pre>');
			result.push('<pre>南無阿彌陀佛</pre>');
			cb(undefined, result.join('<br>'));
			db.close();
		});
		
	});
}
exports.ThisCountList = function(cb) {
	var Now = new Date();
	Now.setHours(Now.getHours() - 17);
	var YearStr = Now.getFullYear().toString();
	var MonthStr = (Now.getMonth() < 9 ? ('0'+(Now.getMonth()+1)):(Now.getMonth()+1).toString());
	var SqliteFileStr = Now.getFullYear().toString() + (Now.getMonth() <9 ? ('0'+(Now.getMonth()+1)):(Now.getMonth()+1).toString());
	var file = "./data/"+SqliteFileStr+".sqlite";
	var exists = fs.existsSync(file);
	if(!exists) {
		console.log("Creating DB file.");
		fs.openSync(file, "w");
	}
	var db = new sqlite3.Database(file);
	db.serialize(function() {
		if(!exists) {
			db.run("CREATE TABLE IF NOT EXISTS BuddhaCount (UserId Integer,Name TEXT,Kind Integer,Date TEXT,Count Integer,PRIMARY KEY(UserId,Kind,Date));");
		}
		result = new Array();
		People = 0;
		SumCount = 0;
		db.each("select UserId,Name,SUM(Count) as Count from BuddhaCount where Kind = 1 group by UserId,Name order by UserId",DateStr,function(err,row){
			//result.push({UserId:row.UserId,Name:row.Name,Count:row.Count});
			result.push('<pre>'+row.UserId+'\t'+row.Name +(row.Name.length <= 2 ? '\t\t':'\t')+FixInteger(row.Count)+'</pre>');
			People +=1;
			SumCount += row.Count;
		}
		,function() {
			result.push('<pre>以上林口極樂虛空念佛堂'+YearStr+'年'+MonthStr+'月</pre>');
			result.push('<pre>念佛總數:\t'+FixInteger(SumCount)+'</pre>');
			result.push('<pre>念佛人數:\t'+FixInteger(People)+'</pre>');
			result.push('<pre>南無阿彌陀佛</pre>');
			cb(undefined, result.join('<br>'));
			db.close();
		});
		
	});
}
exports.TodayStr = function(cb) {
	var Now = new Date();
	Now.setHours(Now.getHours() - 17);
	cb(undefined, {Today:Now.getFullYear().toString()+'年'+(Now.getMonth() <9 ? ('0'+(Now.getMonth()+1)):(Now.getMonth()+1).toString())+'月'
		+(Now.getDate() < 9 ? ('0'+(Now.getDate()+1)):(Now.getDate()+1).toString())+'日'});
}
function FixInteger(val) {
	if(val < 1000)
		return val.toString();
	var result = new Array();
	while(val / 1000 > 0) {
		//console.log(val);
		result.splice(0,0,(val%1000).toString());
		val = Math.floor( val / 1000);
	}
	return result.join(',');
}