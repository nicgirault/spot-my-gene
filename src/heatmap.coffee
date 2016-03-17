d3.SpotMyGene.renderHeatmapCells = (parentContainer, cells, cellsData, params, sampleScale, geneScale) ->
  colorScale = d3.SpotMyGene.buildColorScale(cellsData)

  cells = cells.selectAll('rect')
    .data(cellsData, (d) -> "#{d.sampleId}-#{d.geneId}")

  cells
    .transition()
    .style('fill', (d) -> colorScale(d.value))
    .attr('x', (d) -> sampleScale(d.sampleId))
    .attr('y', (d) -> geneScale(d.geneId))
    .attr('width', params.heatmap.cell.width)
    .attr('height', params.heatmap.cell.height)

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
    .attr('width', params.heatmap.cell.width)
    .attr('height', params.heatmap.cell.height)
    .style('fill', (d) -> colorScale(d.value))

  cells.exit().remove()
