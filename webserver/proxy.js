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
        host: urlParams.host,
        hostname: urlParams.hostname,
        port: urlParams.port,
        path: urlParams.path,
        method: method,
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    };
    var proxyReq = http.request(options, function (response) {
        var buffers = '';
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            buffers += chunk.toString();
        });
        response.on('end', function () {
            callback(JSON.parse(buffers));
        });
    });

    proxyReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.on('data', function (data) {
        proxyReq.write(data);
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
            apisHolder[key] = (function(key) {
                return function (cb) {
                        proxy(apis[key], req, function (data) {
                            cb(null, data);
                        });
                    };
            })(key);
        }
        async.parallel(apisHolder, function (err, data) {
            callback && callback(err, data);
        })
    }
};

/**
 * 下载文件
 * @param  {string} apiUrl 请求的url
 * @param  {obejct} req http请求对象
 * @param  {object} res http应答对象
 * @param  {string=} filename 文件名称
 */
exports.download = function (apiUrl, req, res, filename) {
    apiUrl = config.getRealUrl(apiUrl);
    filename = filename || new Date().getTime();
    var userAgent = (req.headers['user-agent']||'').toLowerCase();
    var urlParams = url.parse(apiUrl);
    var options = {
        host: urlParams.host,
        hostname: urlParams.hostname,
        port: urlParams.port,
        path: urlParams.path,
        method: 'GET'
    };

    var proxyReq = http.request(options, function (response) {
        if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
        } else if(userAgent.indexOf('firefox') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
        } else {
            /*safari等其他非主流浏览器只能自求多福了 */
            res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
        }
        response.pipe(res);
    });

    proxyReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.on('data', function (data) {
        proxyReq.write(data);
    });

    req.on('end', function () {
        proxyReq.end();
    });
};

/**
 * 上传文件
 */
exports.upload = function () {

};


