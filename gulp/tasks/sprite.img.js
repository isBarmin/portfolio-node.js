'use strict';

module.exports = function() {

  $.gulp.task('sprite:img', function() {
    var spriteData = $.gulp.src('./source/sprite/**/*.png')
    .pipe($.gp.spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css'
    }));

    spriteData.img
      .pipe($.gulp.dest($.config.root + '/assets/img'));

    spriteData.css
      .pipe($.gulp.dest($.config.root + '/assets/css'));

    return spriteData;
  });

};


