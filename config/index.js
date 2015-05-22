/**
 * @file 项目的配置信息
 * @author zengcheng
 */
var path = require('path');
var fs = require('fs');
var config = require('./config.js');
var projectInfoCache = {};
var ROUTER_FILENAME = 'router.js';
var API_EVN_TOKEN = '::'; //api接口的分隔符

/**
 * 根据host获取项目的信息
 * @return {obejct} 项目的信息
 *         {
 *            host: {string} 项目对应的host
 *            rootPath: {string} 项目对应的跟目录
 *            hasRouter: {boolean|string} 项目对是否有自定义router,
 *
 *         }
 */
exports.getProjectInfo = function (host) {
    var project = config.etc.domains[host];
    var projectInfo = projectInfoCache[project];
    if (project) {
        var rootPath = config.etc.projects[project] || config.etc.projects.default;
        var routerPath = path.join(rootPath, project, ROUTER_FILENAME);
        var hasRouter = fs.existsSync(routerPath);
        return projectInfo ? projectInfo :
            (projectInfoCache[project] = {
                host: host,
                rootPath: path.join(rootPath, project),
                hasRouter: hasRouter,
                index: config.etc.index[project] || config.etc.index.default,
                router: hasRouter ? require(routerPath) : false
            })
    }
    return false;
};

/**
 * 获取当前配置环境实际的URL
 * @param  {string} url fedev::/sdsd/sdsd?a=1
 * @return {string} 当前环境的URL
 */
exports.getRealUrl = function (url) {
    var tokenIndex = url.indexOf(API_EVN_TOKEN);
    if (tokenIndex > 0) {
        url = config.api[url.substring(0, tokenIndex)] + url.substring(tokenIndex + 1);
    }
    return url;
}

/**
 * 导出默认的配置文件
 */
exports.config = config;