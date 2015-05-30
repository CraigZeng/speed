exports.index = function (req, res) {
    var me = this;
    this.proxy({
        "a": "mainsite::/user/roles",
        "b": "fedev::/index/getInternationalCode"
    });
    //this.bindDefault('');
    this.listenOver(function (data) {
        me.render('/view/index.html', data);
    });
};

exports.testdownload = function (req, res){
    this.download('http://speed.myzone.cn/WindowsXP_SP2.exe', '你好.exe');
};



