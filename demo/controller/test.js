exports.index = function (req, res) {
    var me = this;
    this.proxy({
        "a": "mainsite::/user/roles",
        "b": "fedev::/index/getInternationalCode"
    });
    //this.bindDefault('');
    this.listenOver(function (data) {
        me.render('sdsdsd/sdsd/sdsd.html', data);
    });
};



