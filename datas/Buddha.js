var parse = require('csv-parse');
require('should');

var inputFile='name_list.csv';

exports.QueryName = function(Name,cb) {
    if (typeof cb !== 'function') {
        throw new Error('need a callback');
    }
	var parser = parse({delimiter: ','}, function (err, data) {
		var result = new Array();
		for(var i=1;i<data.length;i++){
			var onevals = data[i];
			if(onevals[1].indexOf(Name) > -1) 
					result.push({ID:onevals[0],Name:onevals[1],Note:onevals[2]});
		}
		cb(err, result);
	});
	fs.createReadStream(inputFile).pipe(parser);
}