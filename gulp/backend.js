const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const del = require('del');
const runSequence = require('run-sequence');

const tsconfig = require('../tsconfig.json');
const serverOutput =  path.resolve(__dirname, 'server');

gulp.task('server-main', () => {
    return gulp.src('App/server.js')
        .pipe(gulp.dest(serverOutput));
});

gulp.task('server-modules', () => {
    return gulp.src('App/**/*.ts')
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(gulp.dest(serverOutput));
});

gulp.task('server-clean', () => del(serverOutput));

gulp.task('backend', (done) => {
    runSequence('server-clean', ['server-main', 'server-modules'], () => done());
});
