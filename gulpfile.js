// Requiring Gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');

var del = require('del');
var merge = require('merge-stream');

// Browser sync
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });
});

// Sass compiler
gulp.task('sass', function() {
  gulp.src('app/scss/style.scss') // Get source files with gulp.src
    .pipe(sourcemaps.init()) // Initialize sourcemap plugin
    .pipe(sass()) // Passes it through a gulp-sass task
    .pipe(autoprefixer()) // Passes it through gulp-autoprefixer
    .pipe(sourcemaps.write('../maps')) // Writing sourcemaps
    .pipe(gulp.dest('app/css')) // Outputs the file in the destination folder
    // Reloading the stream
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Run gulp watch to make magic
gulp.task('watch', ['browser-sync', 'sass'], function() {
  gulp.watch('app/scss/style.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
});

// Clean dist-folder
gulp.task('clean', function() {
  return del(['dist/**']);
});

// Minify assets (see index.html) and add rev for cached files
gulp.task('usemin', ['clean'], function() {
  return gulp.src('./app/*.html')
    .pipe(usemin({
      css: [rev()],
      html: [],
      js: [ rev() ]
    }))
    .pipe(gulp.dest('dist/'));
});

// Copy fixed assets (html, images, fonts, etc.) to dist-folder
gulp.task('copy-assets', ['clean'], function() {
  var html = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist/'));

  var images = gulp.src('app/images/**')
    .pipe(gulp.dest('dist/images/'));

  return merge(html, images);
});

// Check js
gulp.task('jshint', function() {
  return gulp.src(['app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('minify', ['sass', 'usemin', 'copy-assets']);
gulp.task('default', ['minify']);
