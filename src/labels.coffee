d3.SpotMyGene.renderSampleLabels = (parentElement, scale, params, data) ->
  axis = d3.svg.axis()
    .scale(scale)
    .orient('top')

  label = parentElement.select '.heatmap'
    .append('g')
    .attr('class', 'x axis')
    .call(axis)
    .selectAll('text')
    .attr('transform', "translate(#{params.heatmap.cell.width/3}, 0) rotate(-45)")
    .style('text-anchor', 'start')
    .on 'mouseover', (d, i, j) ->
      d3.SpotMyGene.dispatch.sampleMouseover d, i, j
    .on 'mouseout', (d, i, j) ->
      d3.SpotMyGene.dispatch.sampleMouseout d, i, j

  d3.SpotMyGene.listenSampleMouseover(label, params, data)
  parentElement

d3.SpotMyGene.renderGeneLabels = (parentElement, scale, params, data) ->
  geneAxis = d3.svg.axis()
    .scale(scale)
    .orient('left')

  label = parentElement.select '.heatmap'
    .append('g')
    .attr('class', 'y axis')
    .call(geneAxis)
    .selectAll('text')
    .attr("transform", "translate(-6," + params.heatmap.cell.height / 1.5 + ")")
    .style('text-anchor', 'end')
    .on 'mouseover', (d, i, j) ->
      d3.SpotMyGene.dispatch.geneMouseover d, i, j
    .on 'mouseout', (d, i, j) ->
      d3.SpotMyGene.dispatch.geneMouseout d, i, j

  d3.SpotMyGene.listenGeneMouseover(label, params, data)
  parentElement
