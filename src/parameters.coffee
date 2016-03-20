d3.SpotMyGene.Parameters = (parameters) ->

  defaults =
    container: '#chart'
    width: 800
    maxHeight: 2000
    margins:
      left: 10
      top: 10
    sampleLabels:
      length: 65
      showTooltips: true
      tooltipContent: (d) ->
        html = '<table class="c3-tooltip">'
        for key, value of d.summary
          html += '<tr><td>' + key + '</td><td> ' + value + '</td></tr>'
        html += '</table>'
        html
    geneLabels:
      length: 100
      showTooltips: true
      tooltipContent: (d) ->
        html = '<ul>'
        for key, value of d.metadata
          html += '<li><b>' + key + '</b>: ' + value + '</li>'
        html += '</ul>'
        html
    sampleDendogram: height: 200
    geneDendogram: height: 200
    heatmap:
      cell:
        height: 30
      colors: [
        '#E75753'
        '#FEFEFE'
        '#009688'
      ]
    enableZoom: false
    legend:
      container: '#legend'
      width: 700
      height: 20
      size: 10
      labels:
        size: 9
        precision: 2
        color: '#444'

  d3.SpotMyGene.defaults parameters, defaults
