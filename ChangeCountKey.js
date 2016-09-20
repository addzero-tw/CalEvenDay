var Random = require("random-js");
var fs = require('fs');
var random = new Random(Random.engines.mt19937().autoSeed());

/*console.log(random.string(20));*/
var BuddhaCountKey = random.string(20);
var ConstStr = 'exports.BuddhaCountKey=\''+BuddhaCountKey+"\';";
fs.writeFile("BuddhaCountKey.js", ConstStr, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 