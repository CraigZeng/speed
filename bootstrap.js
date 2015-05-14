/**
 *
 *  @file speed的启动入口
 *  @author zengcheng
 *
 */

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var webserver = require('./webserver/index.js');
var logger = require('./logger/index.js');
var config = require('./config/config.json');

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', function (worker, code, signal) {
        logger.warn('node process pid:' + worker.process.pid + ' exits');
        cluster.fork();
        logger.info('restart node child process');
    });
    cluster.on('listening', function (worker) {
        logger.info('node process pid:' + worker.process.pid + ' start');
    });
} else {
    http.createServer(function (req, res) {
        webserver.router(req, res);
    }).listen(config.webserver.port);
}