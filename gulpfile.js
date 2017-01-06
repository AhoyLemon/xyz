var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-pug');
var browserSync = require('browser-sync').create();

gulp.task('test', function() {
  console.log('This works.');
});

gulp.task('sass', function(){
  return gulp.src('sass/idiots.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('jade', function() {
  var YOUR_LOCALS = {};
  gulp.src(['./jade/*.jade', '!./jade/partials/*.jade'])
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('sass/idiots.scss', ['sass']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    }
  });
});