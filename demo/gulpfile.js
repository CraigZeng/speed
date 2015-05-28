var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var deployStatic = require('gulp-deploy-static');
var amdOptimize = require('gulp-amd-optimize');

gulp.task('usemin', function () {
  return gulp.src('./view/*.html')
      .pipe(usemin({
        css: [minifyCss(), rev()],
        js: [rev()],
        inlinejs: [uglify()],
        inlinecss: [minifyCss(), 'concat'],
        assetsDir : './'
      }))
      .pipe(deployStatic({
        all: function (path){
            return 'http://www.baidu.com' + path;
        }
      }))
      .pipe(gulp.dest('build/'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('build/static/js'));
});

gulp.task('rjs', function () {
    return gulp.src('build/static/js/**/*.js')
        .pipe(amdOptimize("main", {}))
        .pipe(gulp.dest("build/static/js/"));
});

gulp.task('default', ['usemin', 'rjs']);