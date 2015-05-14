/**
 * @file 控制整个web服务的路由
 * @author zengcheng
 */
var config = require('../config/index.js');

/**
 * 获取当前的host,pathname
 * @param {obejct} req http的请求对象
 * @return {object}
 *         {
 *             host: "www.abc.com", 请求的host
 *             path: "/abc/def/"  请求的path
 *         }
 */
function getReqInfo = function (req) {

    return {
        host: "www.baidu.com",
        path: "/wallet/index"
    }
};

/**
 * 获取对应的controller
 * @param  {string} pathname  请求路径
 * @param  {object} projectInfo 项目的基本信息
 * @return {boolean|string} controller存在则返回对象，否则返回false
 */
function getController = function (pathname, projectInfo) {

};

/**
 * 路由分发
 * 根据域名分发到对应的项目的controller处理
 */
exports.dispatch = function (req, res) {
    var etc = config.config.etc;

    //获取当前的请求信息
    var reqInfo = getReqInfo(req);

    //获取当前的项目信息
    var projectInfo = config.getProjectInfo(reqInfo.host);

    //获取对应的controller
};