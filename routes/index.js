var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.jsonCache('index', { title: 'Express' }, req.originalUrl);
});

module.exports = router;
