const path = require('path');
const gulp = require('gulp');
const templateCache = require('gulp-angular-templatecache');
const tslint = require('gulp-tslint');
const ts = require('gulp-typescript');
const del = require('del');
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
const mocha = require('gulp-mocha');
const KarmaServer = require('karma').Server;

const tsconfig = require('./tsconfig.json');
const webpackConfig = require('./webpack.config');
const serverOutput =  path.resolve(__dirname, 'server');
const appOutput = path.resolve(__dirname, 'dist/bundle')

/**
 * Front end
 */

webpackConfig.output = { 
  filename: 'bundle.js' 
};

gulp.task('clean-frontend', () => del(appOutput));

gulp.task('views', function() {
  return gulp.src('wwwroot/App/Components/**/*.htm')
    .pipe(templateCache({
      standalone: true
    }))
    .pipe(gulp.dest('./wwwroot/App'));
});

gulp.task('angular-app', () => {
  return gulp.src('wwwroot/App/Boot.ts')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(appOutput));
});

gulp.task('tslint',  () => {
  gulp.src('wwwroot/App/**/*.ts')
    .pipe(tslint({
      formatter: 'stylish'
    }))
    .pipe(tslint.report({
      emitError: false
    }))
});

gulp.task('frontend', (done) => {
  runSequence(['clean-frontend', 'tslint'], 'views', 'angular-app', () => done());
});

/**
 * Backend
 */

gulp.task('server-main', () => {
  return gulp.src('App/server.js')
      .pipe(gulp.dest(serverOutput));
});

gulp.task('server-modules',  () => {
  return gulp.src('App/**/*.ts')
      .pipe(ts(tsconfig.compilerOptions))
      .pipe(gulp.dest(serverOutput));
});

gulp.task('server-clean', () => del(serverOutput));

gulp.task('backend', (done) => {
  runSequence('server-clean', ['server-main', 'server-modules'], () => done());
})

/**
 * All
 */

 gulp.task('buildAll', (done) => {
   runSequence(['frontend', 'backend'], () => done());
 });
 
 /**
  * test
  */

  gulp.task('test-backend', ['backend'], () => {
    return 	gulp.src('server/**/*.test.js', {read: false})
		// `gulp-mocha` needs filepaths so you can't have any plugins before it
		.pipe(mocha({reporter: 'progress'}))
  });

  gulp.task('test-frontend', ['views'], (done) => {
    new KarmaServer({
      configFile: path.resolve(__dirname, 'karma.conf.js')
    }, done).start();
  });