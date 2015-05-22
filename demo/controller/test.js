exports.index = function (req, res) {
    var me = this;
    this.proxy({
        "a": "mainsite::/sds/skk?a=1",
        "b": "fedev::/sdk/kkk?b=1"
    });
    //this.bindDefault('');
    this.listenOver(function (data) {
        me.render('sdsdsd/sdsd/sdsd.html', data);
    });
};



