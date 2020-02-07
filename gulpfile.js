let gulp = require('gulp')

// Build
gulp.task('compile', () => {
  let sourcemaps = require('gulp-sourcemaps')
  let changed = require('gulp-changed')
  let babel = require('gulp-babel')
  return gulp.src('lib/*.es6')
    .pipe(changed('lib', { extension: '.js' }))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('lib'))
})

gulp.task('build:lib', ['compile'], () => {
  return gulp.src('lib/*.js').pipe(gulp.dest('build/lib'))
})

gulp.task('build:docs', () => {
  let ignore = require('fs').readFileSync('.npmignore').toString()
    .trim().split(/\n+/)
    .concat(['.npmignore'])
    .map(i => '!' + i)
  return gulp.src(['*'].concat(ignore))
    .pipe(gulp.dest('build'))
})

gulp.task('build', ['build:lib', 'build:docs'])

// Test

gulp.task('test', ['compile'], () => {
  let jest = require('gulp-jest').default
  return gulp.src('test/').pipe(jest())
})

gulp.task('integration', ['build'], done => {
  let real = require('postcss-parser-tests/real')
  let safe = require('./build')
  real(done, [['Browserhacks', 'http://browserhacks.com/']], css => {
    return safe(css).toResult({ map: { annotation: false } })
  })
})

// Common

gulp.task('default', ['lint', 'test', 'integration'])
