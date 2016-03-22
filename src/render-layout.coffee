d3.SpotMyGene.Core.prototype.render2 = (data, params) ->
  svg = d3.select(params.container)
    .append 'svg'
    .style 'width', params.width
    .style 'height', params.heatmap.cell.height * data.genes.length + params.sampleLabels.length + params.sampleDendogram.height + params.margins.top

  svg.selectAll('*').remove()

  svg.append 'g'
    .attr 'class', 'sample-dendogram'
    .attr 'transform', "translate(#{params.margins.left + params.geneLabels.length + params.geneDendogram.height}, 0)"

  svg.append 'g'
    .attr 'class', 'gene-dendogram'
    .attr 'transform', "translate(#{params.margins.left}, #{params.sampleLabels.length + params.sampleDendogram.height + params.heatmap.height + params.heatmap.cell.height/2}) rotate(-90)"

  heatmap = svg.append 'g'
    .attr 'class', 'heatmap-with-labels'
    .attr 'transform', "translate(#{params.margins.left + params.geneDendogram.height}, #{params.margins.top + params.sampleDendogram.height})"

  heatmap.append('clipPath')
    .attr('id', 'sample-labels-panel') # TODO: add number to guarantee unique id
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', params.heatmap.width)
    .attr('height', params.sampleLabels.length)
  heatmap.append 'g'
    .attr 'class', 'sample-labels'
    .attr 'transform', "translate(#{params.geneLabels.length}, 0)"
    .attr('clip-path', 'url(#sample-labels-panel)')

  heatmap.append('clipPath')
    .attr('id', 'gene-labels-panel') # TODO: add number to guarantee unique id
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', params.geneLabels.length)
    .attr('height', params.heatmap.height)
  heatmap.append 'g'
    .attr 'class', 'gene-labels'
    .attr 'transform', "translate(0, #{params.sampleLabels.length})"
    .attr('clip-path', 'url(#gene-labels-panel)')

  heatmap.append('clipPath')
    .attr('id', 'heatmap-panel') # TODO: add number to guarantee unique id
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', params.heatmap.width)
    .attr('height', params.heatmap.height)
  heatmap.append('g')
    .attr('class', 'heatmap')
    .attr('transform', "translate(#{params.geneLabels.length}, #{params.sampleLabels.length})")
    .attr('clip-path', 'url(#heatmap-panel)')

  @render(svg, data, params)
