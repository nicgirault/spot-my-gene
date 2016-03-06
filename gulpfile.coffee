gulp = require 'gulp'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
gutil = require 'gulp-util'
mocha = require 'gulp-mocha'
less = require 'gulp-less'

gulp.task 'build', ['less'], ->
  gulp.src [
    'src/spot-my-gene.coffee'
    'src/mouseover-gene.coffee'
    'src/mouseover-sample.coffee'
    'src/mouseover-cell.coffee'
    'src/colors.coffee'
    'src/highlight.coffee'
    'src/labels.coffee'
    'src/render.coffee'
  ]
  .pipe concat 'spot-my-gene.coffee'
  .pipe coffee bare: true
  .pipe gulp.dest 'dist'

gulp.task 'watch', ['build'], ->
  gulp.watch 'src/**/*.coffee', ['build']
  gulp.watch 'src/**/*.less', ['less']

gulp.task 'less', (done) ->
  gulp.src 'src/*.less'
  .pipe less()
  .pipe concat 'spot-my-gene.css'
  .pipe gulp.dest 'dist'
  .on 'end', done
  return


# gulp.task 'test', ['build'], ->
#   gulp.src 'src/**/*test.coffee', read: false
#   .pipe mocha reporter: 'spec', compilers: 'coffee:coffee-script'
#   .on 'error', gutil.log
#
# gulp.task 'tdd', ['test'], ->
#   gulp.watch ['src/**/*.coffee'], ['test']
