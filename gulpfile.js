'use strict';

var gulp          = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var tslint = require('gulp-tslint');

// Views task
gulp.task('views', function() {

  // Process  view files from App
  return gulp.src('./wwwroot/App/Components/**/*.htm')
    .pipe(templateCache({
      standalone: true
    }))
    .pipe(gulp.dest('./wwwroot/App'));
});

gulp.task('tslint', function () {
  gulp.src('././wwwroot/App/**/*.ts')
    .pipe(tslint({
      formatter: 'stylish'
    }))
    .pipe(tslint.report({
      emitError: false
    }))
})
