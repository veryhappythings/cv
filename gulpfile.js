const { dest, src, series, watch } = require('gulp');
var path = require('path');
var fs = require('fs');

var markdown = require('gulp-markdown');
var less = require('gulp-less');
var wrapper = require('gulp-wrapper');
var cleanCSS = require('gulp-clean-css');

var browserSync = require('browser-sync');

var paths = {
  dist: 'dist',
  less: './less/**/*.less',
  md: ['*.md', '*.html'],
}

function buildLess(cb) {
  src(paths.less)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(cleanCSS())
    .pipe(dest('./dist/css'));
  cb();
};

function buildMd(cb) {
  src('index.md')
    .pipe(markdown())
    .pipe(wrapper({
      header: fs.readFileSync('header.html', 'utf8'),
      footer: fs.readFileSync('footer.html', 'utf8')
    }))
    .pipe(dest(paths.dist));

  cb();
};

function serve(cb) {
  browserSync.init({
    files: paths.dist,
    server: {
      baseDir: paths.dist
    }
  });

  watch(paths.less, buildLess);
  watch(paths.md, buildMd);

  cb();
};

exports.default = series(buildMd, buildLess, serve);
