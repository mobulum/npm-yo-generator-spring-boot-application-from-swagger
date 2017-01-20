'use strict';
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');

gulp.task('eslint', function eslintTask() {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function nspTask(cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function preTestTask() {
  return gulp.src('lib/**/*.js')
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function testTask(cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function onError(err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function onEnd() {
      cb(mochaErr);
    });
});

gulp.task('watch', function watchTask() {
  gulp.watch(['generators/**/*.js', 'test/**'], ['test']);
});

gulp.task('coveralls', ['test'], function coverallsTask() {
  return (process.env.CI) ? gulp.src(path.join(__dirname, 'coverage/lcov.info')).pipe(coveralls()) : {};
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['eslint', 'test', 'coveralls']);
