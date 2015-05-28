var gulp = require('gulp');
var path = require('path');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var lessc = require('gulp-less');
var deployStatic = require('gulp-deploy-static');
var amdOptimize = require('gulp-amd-optimize');
var through = require('through2');
var gutil = require('gulp-util');

var JS_STATIC_DIR = path.join('.', 'static', 'js');

var rjs = function() {
  return through.obj(function(file, enc, callback) {
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-deploy-static', 'Streams are not supported!'));
      callback();
    }
    else if (file.isNull())
      callback(null, file);
    else {
      try {
        var resultPath = file.path;
        var resultContent = '';
        var that = this;
        var stream = through.obj(function(file, enc, streamCallback) {
            streamCallback(null, file);
        });
        var moduleName = path.relative(path.resolve(JS_STATIC_DIR), resultPath).slice(0, -3);
        stream
            .pipe(amdOptimize(moduleName, {wrapShim: true, baseUrl:JS_STATIC_DIR}))
            .on('data', function(file) {
                resultContent = resultContent + new String(file.contents);
            })
            .on('end', function(){
                resultContent = resultContent
                    + 'require(["' + moduleName + '"], function (mod) {'
                    +       'mod.init();'
                    + '});';
                callback(null, new gutil.File({
                  path: resultPath,
                  contents: new Buffer(resultContent)
                }));
            });
        stream.write(file);
        stream.end();
      } catch(e) {
        this.emit('error', e);
        callback();
      }
    }
  });
}

gulp.task('usemin', function () {
  return gulp.src('./view/*.html')
      .pipe(usemin({
        css: [lessc(), 'concat', minifyCss(), rev()],
        js: [rjs(), 'concat', uglify(), rev()],
        inlinejs: [uglify()],
        inlinecss: [minifyCss(), 'concat'],
        assetsDir : './'
      }))
      .pipe(deployStatic({
        all: function (path){
            return 'http://www.baidu.com' + path;
        }
      }))
      .pipe(gulp.dest('build/'));
});

gulp.task('default', ['usemin']);