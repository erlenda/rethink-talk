var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var webserver = require('gulp-webserver');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var duration = require('gulp-duration');

var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');

//var websocketServer = require('./js/server/index');
var ENTRYPOINT = './js/client/client.js';

function scripts(watch) {
  var bundler,
      rebundle,
      pkg = JSON.parse(fs.readFileSync('./package.json'));

  bundler = browserify(ENTRYPOINT, {
    basedir: __dirname,
    debug: true,
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler);
  }

  bundler.transform(reactify);
  var rebundleTimer;

  rebundle = function() {
    rebundleTimer = duration('bundle time');
    var stream = bundler.bundle();
    stream.on('error', handleError);
    stream = stream.pipe(source(ENTRYPOINT));
    return stream.pipe(gulp.dest('./dist'));
  };

  bundler.on('update', function () {
    rebundle();
    gutil.log("Rebundle...");
  });
  return rebundle();
}

gulp.task("bundle-js", function () {
  return scripts(false);
});
