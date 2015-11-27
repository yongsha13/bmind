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
    less = require('gulp-less'),
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
gulp.task('minfycss',function(){
    return gulp.src('./app/css/style.less')
        .pipe(less())
        .pipe(concat('main.css'))
        .pipe(rename({suffix:'.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./app/tpl/'))
});
gulp.task('minfyjs',function(){
    gulp.src('./app/js/*.js')
        .pipe(concat('main.js'))
        //.pipe(uglify())
        .pipe(rename({extname:'.min.js'}))
        .pipe(gulp.dest('./app/tpl/'));
});
gulp.task('watch',function(){
    gulp.start('minfycss','minfyjs');
    gulp.watch('./app/css/*.less',['minfycss']);
    gulp.watch('./app/js/*.js',['minfyjs']);
});
gulp.task('default'/*,['jshint']*/,function(){
    gulp.start('minfycss','minfyjs');
});