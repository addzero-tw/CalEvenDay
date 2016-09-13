var express = require('express');
var router = express.Router();
var buddha = require('../datas/Buddha');

router.get('/', function(req, res, next) {
    res.json({ hello: 'buddha-api' });
});
router.get('/QueryName:Name?', function(req, res, next) {
    var handler = simpleResponseJsonAndCacheHandler(req, res, next);
	var Name = req.query.Name;
	//res.json({ hello: Name });
    buddha.QueryName(Name,handler);
});
router.get('/QueryID:ID?', function(req, res, next) {
    var handler = simpleResponseJsonAndCacheHandler(req, res, next);
	var ID = req.query.ID;
	//res.json({ hello: Name });
    buddha.QueryID(ID,handler);
});
router.get('/CommitCount/:ID/:Name/:Count?',function(req,res,next) {
	var handler = simpleResponseJsonAndCacheHandler(req, res, next);
	var ID = req.params.ID;
	var Name = req.params.Name;
	var Count = req.params.Count;
	//console.log(ID);
	//console.log(Name);
	//console.log(Count);
	buddha.CommitCount(ID,Name,Count,handler);
	
});
router.get('/TodayStr',function(req,res,next) {
	var handler = simpleResponseJsonAndCacheHandler(req, res, next);
	buddha.TodayStr(handler);
});
router.get('/YesterdayCountList',function(req,res,next) {
	var handler = simpleResponseTxtAndCacheHandler(req, res, next);
	buddha.YesterdayCountList(handler);
});
router.get('/ThisMonthCountList',function(req,res,next){
	var handler = simpleResponseTxtAndCacheHandler(req, res, next);
	buddha.ThisCountList(handler);
});
router.get('/UserList',function(req,res,next){
	var handler = simpleResponseJsonAndCacheHandler(req, res, next);
	buddha.UserList(handler);
});
router.get('/AddUser/:ID/:Name/:Note',function(req,res,next){
	var handler = simpleResponseJsonAndCacheHandler(req, res, next);
	var ID = req.params.ID;
	var Name = req.params.Name;
	var Note = req.params.Note;
	buddha.AddUser(ID,Name,Note,handler);
});
router.get('/DelUser/:ID',function(req,res,next){
	var handler = simpleResponseJsonAndCacheHandler(req, res, next);
	var ID = req.params.ID;
	buddha.DelUser(ID,handler);
});
/*
router.get('/CountOff.html',function(req, res, next) {
	res.render('../html/CountOff.html');
});
router.get('/CountOff.js',function(req, res, next) {
	res.render('../public/javascripts/CountOff.js');
});
router.get('/Page1.htm',function(req, res, next) {
	res.render('../html/Page1.htm');
});
router.get('/Page1.png',function(req, res, next) {
	res.render('../html/Page1.png');
});*/
function simpleResponseJsonAndCacheHandler(req, res, next) {
    return function(err, data) {
        if (err) {
            console.log(err);
            next(err);
        }
        else {
            res.jsonCache(data, req.originalUrl);
        }
    };
}
function simpleResponseTxtAndCacheHandler(req, res, next) {
    return function(err, data) {
        if (err) {
            console.log(err);
            next(err);
        }
        else {
            res.sendCache(data, req.originalUrl);
        }
    };
}
function responseErr(next, code, message) {
    if (typeof next !== 'function') {
        console.error('responseErr: missing `next` function');
        return;
    }
    var err = new Error(message);
    err.status = code;
    next(err);
}
module.exports = router;