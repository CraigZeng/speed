var config = {
        "etc": {
            "cluster": false, //是否开启多核模式
            "isDebug": true, //是否处于调试模式
            "projects": {
                "project1" : "/home/work/projects/",
                "default" : "/home/work/projects/"
            },
            "domains": {
                "127.0.0.1:8888" : "project1"
            },
            "index": {
                "project1" : "/home/list", //首页
                "default" : "/home/index"  //默认首页
            }
        },
        "webserver": {
            "port": 8888 //webserver监听的端口
        }
    };

module.exports = exports = config