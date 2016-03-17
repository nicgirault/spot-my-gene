d3.SpotMyGene.Heatmap = (parentContainer, cells, cellsData, params, sampleScale, geneScale) ->
  domain = d3.extent cellsData, (cell) -> cell.value
  domain.splice 1, 0, (domain[0] + domain[1])/2

  colorScale = d3.scale.linear()
    .domain domain
    .range params.colors

  cells = cells.selectAll('rect')
    .data(cellsData, (d) -> "#{d.sampleId}-#{d.geneId}")

  cells
    .transition()
    .style('fill', (d) -> colorScale(d.value))
    .attr('x', (d) -> sampleScale(d.sampleId))
    .attr('y', (d) -> geneScale(d.geneId))
    .attr('width', params.cell.width)
    .attr('height', params.cell.height)

  cells.enter()
    .append('rect')
    .attr('class', 'cell')
    .style('fill', 'white')
    .on 'mouseover', (d) ->
      d3.SpotMyGene.dispatch.cellMouseover(@, d)
    .on 'mouseout', (d) ->
      d3.SpotMyGene.dispatch.cellMouseout(@, d)
    .transition()
    .attr('x', (d) -> sampleScale(d.sampleId))
    .attr('y', (d) -> geneScale(d.geneId))
    .attr('width', params.cell.width)
    .attr('height', params.cell.height)
    .style('fill', (d) -> colorScale(d.value))

  cells.exit().remove()

  @colorScale = colorScale
  @
