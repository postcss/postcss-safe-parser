let gulp = require('gulp')

gulp.task('compile', () => {
  let sourcemaps = require('gulp-sourcemaps')
  let babel = require('gulp-babel')
  return gulp.src('lib/*.es6')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('lib'))
})

gulp.task('build:lib', gulp.series('compile', () => {
  return gulp.src('lib/*.js').pipe(gulp.dest('build/lib'))
}))

gulp.task('build:docs', () => {
  let ignore = require('fs').readFileSync('.npmignore').toString()
    .trim().split(/\n+/)
    .concat(['.npmignore'])
    .map(i => '!' + i)
  return gulp.src(['*'].concat(ignore))
    .pipe(gulp.dest('build'))
})

gulp.task('build', gulp.parallel('build:lib', 'build:docs'))
