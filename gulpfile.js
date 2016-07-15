var gulp = require('gulp');
var webpack = require('webpack-stream');
var less = require('gulp-less');
var path = require('path');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('javascript', function() {
    return gulp.src('src/Cochrane/script/index.js')
        .pipe(webpack({
            output: {
                filename: 'compiled.min.js',
            },
        }))
        .pipe(uglify())
        .pipe(gulp.dest('web/js'));
});

gulp.task('less', function () {
    return gulp.src('src/**/*.less')
        .pipe(less().on('error', function (err) {
            console.log(err);
        }))
        .pipe(concat('compiled.css'))
        .pipe(cssmin().on('error', function(err) {
            console.log(err);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('web/css'));

});

gulp.task('default', ['javascript', 'less']);
