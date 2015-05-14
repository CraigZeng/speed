var path = require('path');
var fs = require('fs');
var config = require('./config.json');
var projectInfoCache = {};
var ROUTER_FILENAME = 'router.js';

/**
 * 根据host获取项目的信息
 * @return {obejct} 项目的信息
 *         {
 *            host: {string} 项目对应的host
 *            rootPath: {string} 项目对应的跟目录
 *            hasRouter: {boolean|string} 项目对是否有自定义router
 *         }
 */
exports.getProjectInfo = function (host) {
    var project = config.domains[host];
    var projectInfo = projectInfoCache[project];
    if (project) {
        return projectInfo ? projectInfo :
            (projectInfoCache[project] = {
                host: host,
                rootPath: path.join(config.projects[project], project),
                hasRouter: fs.existsSync(path.join(config.projects[project], project, ROUTER_FILENAME))
            })
    }
    return false;
};

/**
 * 导出默认的配置文件
 */
exports.config = config;