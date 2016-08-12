

exports.QueryName = function(Name,cb) {
    if (typeof cb !== 'function') {
        throw new Error('need a callback');
    }
	
	cb(err, result);
}