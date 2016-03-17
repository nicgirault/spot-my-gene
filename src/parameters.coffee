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
    genePie:
      container: '#gene-pie'
      colors: [
        '#8dd3c7'
        '#ffffb3'
        '#bebada'
        '#fb8072'
        '#80b1d3'
        '#fdb462'
        '#b3de69'
        '#fccde5'
        '#d9d9d9'
        '#bc80bd'
        '#ccebc5'
        '#ffed6f'
      ]
      accessor: (d, i, j) -> return 'No Accessor defined'
    samplePie:
      container: '#sample-pie'
      colors: d3.scale.category20().range()


  merge = (parameters, defaults) ->
    for key, value of defaults
      if key of parameters
        if Object.prototype.toString.call(value) == '[object Array]'
          defaults[key] = parameters[key]
        else if typeof value == 'object'
          if value? and Object.keys(value).length is 0
            defaults[key] = parameters[key]
          else
            defaults[key] = merge parameters[key], value
        else
          defaults[key] = parameters[key]
      else
        defaults[key] = value
    return defaults

  merge parameters, defaults
