var config = {
        "etc": {
            "cluster": false, //是否开启多核模式
            "isDebug": true, //是否处于调试模式
            "projects": {
                "project1" : "/home/work/projects/",
                "default" : "/Users/bjhl/workspace/node/speed/"
            },
            "domains": {
                "127.0.0.1:8888" : "demo"
            },
            "index": {
                "demo" : "/test/index", //首页
                "default" : "/home/index"  //默认首页
            }
        },
        "api": {
            "fedev" : "192.168.18.44:8080",
            "mainsite" : "192.168.18.44:8080",
        },
        "webserver": {
            "port": 8888 //webserver监听的端口
        }
    };

module.exports = exports = config