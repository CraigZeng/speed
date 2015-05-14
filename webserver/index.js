/**
 * @file webserver入口文件
 * @author zengcheng
 */
var router = require('./router.js');

/**
 * 控制整个路由
 * @param  {object} req http请求对象
 * @param  {object} res http返回对象
 */
exports.router = function (req, res) {
    router.dispatch(req, res);
};