params =
  container: '#chart'
  width: 800
  maxHeight: 2000
  margins:
    left: 10
    top: 10
  sampleLabels:
    length: 30
    showTooltips: true
    tooltipContent: (d) ->
      html = '<ul>'
      for key, value of d.summary
        html += "<li><b>" + key + "</b>: " + value + "</li>"
      html += '</ul>'
      html
  geneLabels:
    length: 30
    showTooltips: true
    tooltipContent: (d) ->
      html = '<ul>'
      for key, value of d.metadata
        html += "<li><b>" + key + "</b>: " + value + "</li>"
      html += '</ul>'
      html
  sampleDendogram:
    height: 400
  geneDendogram:
    height: 200
  heatmap:
    cell:
      height: 30

d3.json 'raw-data.json', (data) ->
  samples = ({id: key, name: key, summary: {test: 'value'}} for key in data.st.samplesorder)
  genes = ({id: key, metadata: {yolo: 'value'}} for key of data.ct)

  formatedData =
    samples: samples
    genes: genes
    matrix: (row.count for key, row of data.ct)

  d3.SpotMyGene(formatedData, params)
