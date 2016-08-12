var express = require('express');
var router = express.Router();
var buddha = require('../datas/Buddha');

router.get('/', function(req, res, next) {
    res.json({ hello: 'buddha-api' });
});
router.get('/QueryName:Name?', function(req, res, next) {
    var handler = simpleResponseJsonAndCacheHandler(req, res, next);
	var Name = req.query.Name;
    buddha.QueryName(Name,handler);
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

module.exports = router;