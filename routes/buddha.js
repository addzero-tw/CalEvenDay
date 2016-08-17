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
router.get('/CountOff.html',function(req, res, next) {
	res.render('../html/CountOff.html');
});
router.get('/CountOff.js',function(req, res, next) {
	res.render('../public/javascripts/CountOff.js');
});
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