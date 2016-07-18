
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    webpack = require('gulp-webpack'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');


gulp.task('webpack', function () {
    gulp.src('./static/**')
        .pipe(gulp.dest('./build/'))
});

gulp.task('default', function(){
    gulp.run('webpack');
});