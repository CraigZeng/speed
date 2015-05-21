var events = require('events');
var util = require("util");

function Controller() {
    this.events = {
        "allover": "ALL_OVER", //所有的接口返回
        "defaultover": "DEFAULT_OVER", //绑定的所有默认接口返回
        "error": "error" //出错
    };
    this.apis = false; //API接口集合
    this.defaultApis = false; //默认API接口集合
}


function proxy(apis, isDefault) {

}

function render(tpl, data) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('ceshi');
}

function listenOver(callback) {
    this.on(this.events.allover, function (err, data) {
        callback(err, data);
    });
}

function bindDefault(defaultFilter) {
    this.defaultApis = defaultFilter;
    this.on(this.events.defaultover, function (err, data) {

    });
}

Controller.prototype = {
    constructor: Controller,

    proxy: proxy,

    render: render,

    listenOver: listenOver
};

module.exports = exports = util.inherits(Controller, events.EventEmitter);