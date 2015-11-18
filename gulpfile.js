/**
 * Created by wangyong on 2015/11/19.
 *
 * 使用本文件请先安装nodejs > gulp
 *如果不懂nodejs和gulp，请问度娘
 *
 * 再安装gulp下的打包压缩
 * npm install gulp-minify-css gulp-uglify gulp-concat gulp-rename gulp-jshint --save-dev
 */
var gulp = require('gulp'),
    minifycss=require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');
/*js语法检查*/
/*gulp.task('jshint',function(){
    return gulp.src('./app/js/!*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});*/
gulp.task('minifycss',function(){
    return gulp.src('./app/css/*.css')
        .pipe(concat('main.css'))
        .pipe(rename({suffix:'.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./app/tpl/'))
});
gulp.task('minfyjs',function(){
    gulp.src('./app/js/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({extname:'.min.js'}))
        .pipe(gulp.dest('./app/tpl/'));
});

gulp.task('default'/*,['jshint']*/,function(){
    gulp.start('minifycss','minfyjs');
});