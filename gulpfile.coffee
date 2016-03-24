gulp = require 'gulp'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
gutil = require 'gulp-util'
mocha = require 'gulp-mocha'
less = require 'gulp-less'
webserver = require 'gulp-webserver'
runSequence = require 'run-sequence'
deploy = require 'gulp-gh-pages'

gulp.task 'compile', ->
  gulp.src [
    'src/0-module.coffee'
    'src/selectable.coffee'
    'src/parameters.coffee'
    'src/mouseover-gene.coffee'
    'src/mouseover-sample.coffee'
    'src/mouseover-cell.coffee'
    'src/colors.coffee'
    'src/highlight.coffee'
    'src/labels/!(*test).coffee'
    'src/labels.coffee'
    'src/clustering.coffee'
    'src/render-heatmap.coffee'
    'src/render-layout.coffee'
    'src/normalization.coffee'
    'src/zoom.coffee'
    'src/heatmap.coffee'
    'src/legend.coffee'
    'src/dendogram/!(*test).coffee'
    'src/pie/!(*test).coffee'
    'src/common/!(*test).coffee'
    'src/behavior/!(*test).coffee'
  ]
  .pipe concat 'spot-my-gene.coffee'
  .pipe coffee bare: true
  .pipe gulp.dest 'dist'

gulp.task 'less', ->
  gulp.src 'src/*.less'
  .pipe less()
  .pipe concat 'spot-my-gene.css'
  .pipe gulp.dest 'dist'

gulp.task 'vendor', ->
  gulp.src [
    'bower_components/d3/d3.min.js'
    'bower_components/c3/c3.min.js'
    'bower_components/d3-tip/index.js'
    'bower_components/async/lib/async.js'
  ]
  .pipe(concat('vendor.js'))
  .on 'error', gutil.log
  .pipe gulp.dest('demo')

gulp.task 'watch', ['compile', 'less', 'vendor'], ->
  runSequence 'webserver', ->
    gulp.watch 'src/**/*.coffee', ['compile']
    gulp.watch 'src/**/*.less', ['less']
    gulp.watch 'src-demo/**/*.coffee', ['demo']

gulp.task 'webserver', ->
  gulp.src ['demo', 'dist']
  .pipe webserver
      livereload: true
      fallback: 'index.html'
      host: '127.0.0.1'
      port: 8008

gulp.task 'deploy', (done) ->
  gulp.src ['demo/**/*', 'dist/**/*']
  .pipe deploy
      message: 'Update ' + new Date().toISOString() + ' --skip-ci'
    .on 'end', done
  return

gulp.task 'demo', ->
  gulp.src [
    'src-demo/**/*.coffee'
  ]
  .pipe coffee bare: true
  .pipe gulp.dest 'demo'
