gulp = require 'gulp'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
gutil = require 'gulp-util'
mocha = require 'gulp-mocha'
less = require 'gulp-less'
webserver = require 'gulp-webserver'
runSequence = require 'run-sequence'
copy = require 'gulp-copy'

gulp.task 'compile', ->
  gulp.src [
    'src/spot-my-gene.coffee'
    'src/mouseover-gene.coffee'
    'src/mouseover-sample.coffee'
    'src/mouseover-cell.coffee'
    'src/colors.coffee'
    'src/highlight.coffee'
    'src/labels.coffee'
    'src/clustering.coffee'
    'src/render-heatmap.coffee'
    'src/render-layout.coffee'
    'src/render-dendogram.coffee'
    'src/normalization.coffee'
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
    'bower_components/d3-tip/index.js'
  ]
  .pipe(concat('vendor.js'))
  .on 'error', gutil.log
  .pipe gulp.dest('demo')

gulp.task 'watch', ->
  runSequence 'webserver', ->
    gulp.watch 'src/**/*.coffee', ['compile']
    gulp.watch 'src/**/*.less', ['less']

gulp.task 'webserver', ->
  gulp.src '.'
  .pipe webserver
      livereload: true
      fallback: 'demo/index.html'
      host: '127.0.0.1'
      port: 8008
