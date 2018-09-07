const path = require('path');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const KarmaServer = require('karma').Server;

const testBackend = path.resolve(__dirname, '../server/**/*.test.js');
const karmaConfig = path.resolve(__dirname, '../karma.conf.js');

gulp.task('test-backend', ['backend'], () => {
    return gulp.src(testBackend, { read: false })
        // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({ reporter: 'progress' }))
});

gulp.task('test-frontend', ['views'], (done) => {
    new KarmaServer({
        configFile: path.resolve(__dirname, karmaConfig)
    }, done).start();
});
