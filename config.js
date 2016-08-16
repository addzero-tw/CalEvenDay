var config = {
	VERSION: 3
};
/**
    請先複製一份放在程式根目錄、並將檔名取為「config.js」

    請依照需求設定下面設定

    使用方式：
        var config = require('./config');
        var dbConfig = config('FULEARN_2');
        console.log(dbConfig);

    error: config key不存在時，會丟出error。
*/
//====================================================================

//====================================================================
/**
    以下不用設定
*/

var exports = module.exports = function(key) {
	var value = config[key];
    if (typeof value !== 'undefined') {
        // return a copy of config
        return value;
    }
    else {
        throw Error(
            'config key: "' + key + '" is not defined, ' +
            'try: ' + Object.keys(config).join(', ')
        );
    }
};

if (require.main === module) {
    var keys = Object.keys(config);
    console.log('config keys: ' + keys.join(', '));
    console.log('configs:');
    console.log(config);
}

if (require('./config.template.js')('VERSION') !== config.VERSION) {
	throw Error('config.js需要更新，請重新設定');
}
