const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('buildAll', (done) => {
    runSequence(['frontend', 'backend'], () => done());
});
