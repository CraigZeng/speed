/**
 * @file 代理http请求
 * @author zengcheng
 */
var http = require('http');
var url = require('url');
var async = require('async');
var config = require('../config/index.js');


/**
 * 代理请求
 * @param  {string}   apiUrl      请求的url
 * @param  {string}   method    GET|POST
 * @param  {object}   req      http的请求对象
 * @param  {Function} callback 代理完成后回调函数
 */
function request(apiUrl, method, req, callback) {
    var urlParams = url.parse(apiUrl);
    var options = {
        hostname: urlParams.hostname,
        port: urlParams.port,
        path: urlParams.path,
        method: method,
        headers: req.headers
    };
    var proxyReq = http.request(options, function (response) {
        var body = '';
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            callback(body);
        });
    });

    proxyReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.on('data', function (data) {
        req.write(data);
    });

    req.on('end', function () {
        proxyReq.end();
    });
}

/**
 * 请求后端服务器数据接口
 * @param  {object|string}   api    api描述
 * @property {string} api.url api的URL
 * @property {string} api.method api的请求方式
 * @param  {obejct}  req http的请求对象
 * @param  {Function} callback请求完成后的回调函数
 */
function proxy(api, req, callback) {
    var url = api;
    var method = req.method;
    if ((typeof api).toLowerCase() === 'object') {
        url = api.url;
        method = api.method || req.method;
    }
    request(config.getRealUrl(url), method.toUpperCase(), req, callback);
}

/**
 * 并发访问后端接口
 * @param  {object}   apis     接口的描述
 *                    {
 *                        "apiname": {object|string}
 *                         :string 接口url 请求方式是req.method
 *                         :object{
 *                              url: {string},
 *                              method: {string(post|get)}
 *                         }
 *                    }
 * @param  {object}   req      http的请求对象
 * @param  {Function} callback 所有接口返回后回调函数
 *         callback({object})
 *         {
 *             "apiname": {object} 对应接口返回的数据
 *         }
 *
 */
exports.parallel = function (apis, req, callback) {
    var apisHolder = {};
    if (apis) {
        for (var key in apis) {
            apisHolder[key] = function (cb) {
                proxy(apis[key], req, function (data) {
                    cb(null, data);
                });
            }
        }
        async.parallel(apisHolder, function (err, data) {
            callback && callback(err, data);
        })
    }
};

exports.download = function (url, req, res) {

};


