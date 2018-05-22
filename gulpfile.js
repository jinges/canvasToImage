/*
 * @Author: 大明冯 
 * @Date: 2018-05-22 10:41:19 
 * @Last Modified by: 大明冯
 * @Last Modified time: 2018-05-22 10:49:06
 */
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');

gulp.task('clean', function (cb) {
  del('lib', cb);
});

gulp.task('build', () =>
  gulp.src('src/drawtable.js')
  .pipe(rename("DrawTable.js"))
  // .pipe(gulp.dest('lib'))
  .pipe(babel({
    presets: [
      ['es2015', {
        "modules": false
      }], 'stage-2'
    ],
    plugins: ["transform-es2015-modules-umd"]
  }))
  .pipe(rename("drawtable.js"))
  .pipe(gulp.dest('lib'))
  .pipe(uglify())
  .pipe(rename({
    extname: '.min.js'
  }))
  .pipe(gulp.dest('lib'))
);

gulp.task('connect', function () {
  connect.server({
    livereload: true,
    host: '192.168.18.239',
    port: 8088
  });
  livereload.listen()
});

gulp.task('watch', function () {
  gulp.watch('src/drawtable.js', ['build']);
  livereload.listen();
});

gulp.task('default', ['clean', 'build', 'connect', 'watch'], () => {
  console.log('success!')
})