'use strict';
var gulp = require('gulp'),
	ejs = require('gulp-ejs'),
	del = require('del');


gulp.task('clean', function() {
	del.sync('html');
});

gulp.task('ejs', function() {
	gulp.src("./src/**/*.html")
    .pipe(ejs())
    .pipe(gulp.dest("./html"));
});

gulp.task('copy', function() {
	gulp.src(["./src/**/*.css","./src/**/*.png","./src/**/*.gif","./src/**/*.jpg","./src/**/*.js"])
    .pipe(gulp.dest("./html"));
});

gulp.task('default', ['clean', 'ejs', 'copy'], function() {
	// 暂时先把所有资源都拷到dist
	//gulp.src(['src/**/*.*', '!src/hrcloud/pages/**/*.ejs', '!src/hrcloud/pages/**/*.json', '!src/hrcloud/pages/**/*-ejs.js'])
	//	.pipe(gulp.dest('dist'));
});