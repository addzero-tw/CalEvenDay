/**
 * 1. Create a NodeCache object
 * 2. Add a jsonCache / sendCache function to express
        Use res.jsonCache(object, cacheKey) to response json and cache
        Use res.sendCache(string, cacheKey) to response plain text and cache  
 * 3. Return created NodeCache object
 */

exports.jsonCache = function(express) {
	var NodeCache = require("node-cache");
	var apiCache = new NodeCache( { stdTTL: 36000, checkperiod: 36000 });
	express.response.jsonCache = function(obj, key) {
		express.response.json.call(this, obj);
		if (obj && key) {
			apiCache.set(key, obj);
		}
		else {
			console.error('jsonCache: check your --> key: ' + key + 'and obj: ' + obj);
		}
	};
	express.response.sendCache = function(str, key) {
		express.response.send.call(this, str);
		if (str && key) {
			apiCache.set(key, str);
		}
		else {
			console.error('jsonCache: check your --> key: ' + key + 'and str: ' + str);
		}
	};
	return apiCache;
};

/**
 * Return a express cache middleware using provided cacheObj
 */
exports.middleware = function(cacheObj) {
    return function(req, res, next) {
        var cached = cacheObj.get(req.originalUrl);
        if (cached){
            if (typeof cached === 'object') {
                res.type('json').json(cached);
            }
            else if (typeof cached === 'string') {
                res.send(cached);
            }
        }
        else {
            next();
        }
    };
};
