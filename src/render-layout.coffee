d3.SpotMyGene.Core.prototype.render2 = (data, params) ->
  svg = d3.select(params.container)
    .append 'svg'
    .style 'width', params.width

  svg.selectAll('*').remove()

  # svg.append('g').attr('class', 'sample-dendogram')
  # svg.append('g').attr('class', 'gene-dendogram')

  heatmap = svg.append 'g'
    .attr 'class', 'heatmap-with-labels'
    .attr 'transform', "translate(#{params.margins.left}, #{params.margins.top})"

  heatmap.append 'g'
    .attr 'class', 'sample-labels'
    .attr 'transform', "translate(#{params.geneLabels.length}, #{params.sampleLabels.length})"

  heatmap.append 'g'
    .attr 'class', 'gene-labels'
    .attr 'transform', "translate(#{params.geneLabels.length}, #{params.sampleLabels.length})"

  heatmap.append 'g'
    .attr 'class', 'heatmap'
    .attr 'transform', "translate(#{params.geneLabels.length}, #{params.sampleLabels.length})"

  @render(svg, data, params)
