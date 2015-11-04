var gulp = require('gulp')
var webserver = require('gulp-webserver')
var livereload = require('gulp-livereload')
var watch = require('gulp-watch')

gulp.task('webserver', function () {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      fallback: 'index.html'
    }))
})

gulp.task('js', function () {
  gulp.src('app/*.js')
    .pipe(watch('app/*.js'))
    .pipe(livereload())
})

gulp.task('default', ['webserver'])

