var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

var markdown = require('gulp-markdown');
var less = require('gulp-less');
var wrapper = require('gulp-wrapper');
var minifyCSS = require('gulp-minify-css');

var browserSync = require('browser-sync');

var paths = {
  less: './less/**/*.less',
  dist: 'dist'
}

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('less-watch', ['less'], browserSync.reload);

gulp.task('md', function () {
  return gulp.src('index.md')
    .pipe(markdown())
    .pipe(wrapper({
      header: fs.readFileSync('header.html', 'utf8'),
      footer: fs.readFileSync('footer.html', 'utf8')
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('md-watch', ['md'], browserSync.reload);

gulp.task('serve', ['md', 'less'], function() {
  browserSync({
    server: {
      baseDir: paths.dist
    }
  });
  gulp.watch(paths.less, ['less-watch']);
  gulp.watch(['*.md', '*.html'], ['md-watch']);
});

gulp.task('default', ['serve']);
