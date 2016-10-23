'use strict';

module.exports = function() {
  $.gulp.task('copy:userfiles', function() {
    return $.gulp.src('./source/userfiles/**/*.*', { since: $.gulp.lastRun('copy:userfiles') })
      .pipe($.gulp.dest($.config.root + '/assets/userfiles'));
  });
};
