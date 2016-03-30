module.exports = (config) ->
  config.set
    frameworks: ['jasmine', 'sinon']
    files: [
      'bower_components/d3/d3.js'
      'bower_components/c3/c3.js'
      'src/**/*.coffee'
    ]
    exclude: []
    preprocessors:
      '**/*.coffee': ['coffee']
      '**/!(*test).coffee': ['coverage']
    coverageReporter:
      dir: 'coverage'
      reporters: [
        type: 'html'
        subdir: 'client-report'
      ,
        type: 'text-summary'
      ]
      watermarks:
        statements: [70, 80]
        functions: [70, 80]
        branches: [70, 80]
        lines: [70, 80]
    reporters: [ 'spec', 'coverage' ]
    port: 9876
    colors: true
    logLevel: config.LOG_INFO
    autoWatch: true
    browsers: [ 'PhantomJS' ]
    singleRun: process.env.SINGLE_RUN || true
  return
