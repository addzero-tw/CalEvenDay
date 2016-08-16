var parse = require('csv-parse');
const fs = require('fs');
require('should');

var inputFile='./data/name_list.csv';

exports.QueryName = function(Name,cb) {
    if (typeof cb !== 'function') {
        throw new Error('need a callback');
    }
	
	var parser = parse({delimiter: ','}, function (err, data) {
		//console.log(Name);
		var result = new Array();
		for(var i=1;i<data.length;i++){
			var onevals = data[i];
			//console.log(onevals[1]);
			if(onevals[1].indexOf(Name) > -1) {
				result.push({ID:onevals[0],Name:onevals[1],Note:onevals[2]});
			}
		}
		cb(err, result);
	});
	fs.createReadStream(inputFile).pipe(parser);
}
exports.QueryID = function(ID,cb) {
    if (typeof cb !== 'function') {
        throw new Error('need a callback');
    }
	
	var parser = parse({delimiter: ','}, function (err, data) {
		//console.log(Name);
		var result = new Array();
		for(var i=1;i<data.length;i++){
			var onevals = data[i];
			//console.log(onevals[1]);
			if(onevals[0].indexOf(ID) == 0) {
				result.push({ID:onevals[0],Name:onevals[1],Note:onevals[2]});
			}
		}
		cb(err, result);
	});
	fs.createReadStream(inputFile).pipe(parser);
}