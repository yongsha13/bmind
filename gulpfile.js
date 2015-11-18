/**
 * Created by wangyong on 2015/11/19.
 *
 * 使用本文件请先安装nodejs > gulp
 *如果不懂nodejs和gulp，请问度娘
 *
 * 再安装gulp下的打包压缩
 * npm install gulp-minify-css gulp-uglify gulp-concat gulp-rename gulp-jshint --save-dev
 */
var gulp = require('gulp');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

gulp.task('minjs',function(){
    gulp.src('./app/js/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({extname:'.min.js'}))
        .pipe(gulp.dest('./app/tpl/'));
});

gulp.task('default',function(){
    gulp.start('minjs');
});