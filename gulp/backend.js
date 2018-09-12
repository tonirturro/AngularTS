const gulp = require('gulp');
const path = require('path');
const del = require('del');
const webpack = require('webpack-stream');
const runSequence = require('run-sequence');
const webpackConfigServer = require('../webpack/webpack.config.server');

const serverOutput = path.resolve(__dirname, '../server');
const serverSources = path.resolve(__dirname, '../src/backend');
const serverMain = path.resolve(serverSources, 'server.js');

gulp.task('server-modules', () => {
    return gulp.src(serverMain)
        .pipe(webpack(webpackConfigServer))
        .pipe(gulp.dest(serverOutput));
});

gulp.task('server-clean', () => del(serverOutput));

gulp.task('backend', (done) => {
    runSequence('server-clean', 'server-modules', () => done());
});
