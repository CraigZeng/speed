/**
 * @file 控制整个web服务的路由
 * @author zengcheng
 */
var config = require('../config/index.js');
var url = require('url');
var path = require('path');
var fs = require('fs');

/**
 * 获取当前的host,pathname
 * @param {obejct} req http的请求对象
 * @return {object}
 *         {
 *             host: "www.abc.com", 请求的host
 *             path: "/abc/def/"  请求的path
 *         }
 */
function getReqInfo(req) {
    var urlObj = url.parse(req.url, true);
    return {
        host: req.headers.host,
        path: urlObj.pathname
    }
};

/**
 * 获取对应的controller
 * @param  {string} pathname  请求路径
 * @param  {object} projectInfo 项目的基本信息
 * @return {boolean|string} controller存在则返回对象，否则返回false
 */
function getController(req, pathname, projectInfo) {
    var controller = false;
    var controllerPath = pathname || '/';
    if (projectInfo.hasRouter) {
        controllerPath = projectInfo.router.getController(pathname, req);
    }
    var controllerFunc = controllerPath.split('/');
    if (!controllerFunc[1]) {
        controllerFunc = projectInfo.index.split('/');
    }
    if (!controllerFunc[2]) {
        controllerFunc[2] = 'index';
    }
    controllerPath = path.join(projectInfo.rootPath, controllerFunc[1]) + '.js';
    if (fs.existsSync(controllerPath)) {
        controller = require(controllerPath);
        if (controller[controllerFunc[2]]) {
            return {
                controller: controller,
                method: controllerFunc[2]
            }
        }
        controller = false;
    }
    return controller;
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
    var controllerMethod = getController(req, reqInfo.path, projectInfo);

    if (controllerMethod) {
        controllerMethod.controller[controllerMethod.method](req, res);
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('notfound');
    }
};