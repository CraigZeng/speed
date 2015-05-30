/**
 * @file  基础controller类, 提供了基本的controller方法
 * @author zengcheng
 */
var events = require('events');
var util = require("util");

var proxyUtil = require('./proxy.js');

/**
 * Controller构造函数
 */
function Controller(req, res) {
    //事件种类
    this.events = {
        "allover": "ALL_OVER", //所有的接口返回
        "defaultover": "DEFAULT_OVER", //绑定的所有默认接口返回
        "error": "error" //出错
    };
    //API接口集合
    this.apis = false;

    this.req = req;
    this.res = res;
}


/**
 * 待发送的接口集合
 * @param  {obejct}  apis 接口集合的描述
 */
function proxy(apis) {
    var me = this;
    this.apis = apis || false;
    setTimeout(function() {
        proxyUtil.parallel(me.apis, me.req, function (err, data) {
            if (err) {
                me.emit(me.events.error, err);
            }
            me.emit(me.events.defaultover, data);
            me.emit(me.events.allover, data);
        });
    }, 0);
}

/**
 * 下载文件
 * @param  {string} url 文件地址
 */
function download(url, filename) {
    proxyUtil.download(url, this.req, this.res, filename);
}

/**
 * 调用模板引擎渲染模板
 * @param  {string} tpl  模板路径
 * @param  {object} data 模板对应的数据
 */
function render(tpl, data) {
    this.res.writeHead(200, {'Content-Type': 'application/json;charset=utf8'});
    this.res.end(JSON.stringify(data));
}

/**
 * 监听所有接口请求完成事件
 * @param  {Function} callback 事件完成后回调函数
 */
function listenOver(callback) {
    this.on(this.events.allover, function (err, data) {
        callback(err, data);
    });
}

/**
 * 绑定默认接口
 */
function bindDefault() {

}

//继承事件机制
util.inherits(Controller, events.EventEmitter);

Controller.prototype.constructor = Controller;
Controller.prototype.proxy =  proxy;
Controller.prototype.download = download;
Controller.prototype.render = render;
Controller.prototype.listenOver = listenOver;
Controller.prototype.bindDefault = bindDefault;

module.exports = exports = Controller