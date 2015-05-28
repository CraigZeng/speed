define('common', [
    'require',
    'exports',
    'module'
], function (require, exports) {
    console.log('kkksss');
    exports.init = function () {
        console.log('test');
    };
});define('home/index', [
    'require',
    'exports',
    'module',
    'common'
], function (require, exports) {
    var a = require('../common');
    exports.init = function () {
        a.init();
        console.log('ss');
    };
});require(["home/index"], function (mod) {mod.init();});