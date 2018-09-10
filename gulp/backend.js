const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const del = require('del');
const runSequence = require('run-sequence');

const tsconfig = require('../tsconfig.json');
const serverOutput =  path.resolve(__dirname, '../server');
const serverSources = path.resolve(__dirname, '../src/backend');
const serverMain = path.resolve(serverSources, 'server.js');
const serverModules = path.resolve(serverSources, '**/*.ts');

gulp.task('server-main', () => {
    return gulp.src(serverMain)
        .pipe(gulp.dest(serverOutput));
});

gulp.task('server-modules', () => {
    return gulp.src(serverModules)
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(gulp.dest(serverOutput));
});

gulp.task('server-clean', () => del(serverOutput));

gulp.task('backend', (done) => {
    runSequence('server-clean', ['server-main', 'server-modules'], () => done());
});
