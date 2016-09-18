var Random = require("random-js");
var random = new Random(Random.engines.mt19937().autoSeed());

console.log(random.string(20));