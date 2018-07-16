const gulp = require('gulp')

gulp.task('clean', () => {
  const del = require('del')
  return del(['build/', 'lib/*.js'])
})

// Build
gulp.task('compile', () => {
  const sourcemaps = require('gulp-sourcemaps')
  const changed = require('gulp-changed')
  const babel = require('gulp-babel')
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
  const ignore = require('fs').readFileSync('.npmignore').toString()
    .trim().split(/\n+/)
    .concat(['.npmignore'])
    .map(i => '!' + i)
  return gulp.src(['*'].concat(ignore))
    .pipe(gulp.dest('build'))
})

gulp.task('build', done => {
  const runSequence = require('run-sequence')
  runSequence('clean', ['build:lib', 'build:docs'], done)
})

// Lint

gulp.task('lint', ['build'], () => {
  const eslint = require('gulp-eslint')
  return gulp.src(['*.js', 'lib/*.es6', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

// Test

gulp.task('test', ['compile'], () => {
  const jest = require('gulp-jest').default
  return gulp.src('test/').pipe(jest())
})

gulp.task('integration', ['build'], done => {
  const real = require('postcss-parser-tests/real')
  const safe = require('./build')
  real(done, [['Browserhacks', 'http://browserhacks.com/']], css => {
    return safe(css).toResult({ map: { annotation: false } })
  })
})

// Common

gulp.task('default', ['lint', 'test', 'integration'])
