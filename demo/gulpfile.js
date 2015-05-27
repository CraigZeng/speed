var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var deployStatic = require('gulp-deploy-static');

gulp.task('usemin', function () {
  return gulp.src('./view/*.html')
      .pipe(usemin({
        css: [minifyCss(), 'concat'],
        js: [uglify(), rev()],
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