d3.SpotMyGene.renderHeatmapAxes = (geneLabels, sampleLabels, geneScale, sampleScale, params) ->
  geneAxis = d3.svg.axis().orient('right')
  geneAxis.scale(geneScale)
  geneLabels.call(geneAxis)

  sampleAxis = d3.svg.axis().orient('bottom')
  sampleAxis.scale(sampleScale)
  sampleLabels.call(sampleAxis)
    .selectAll('text')
    .attr('transform', "translate(#{params.heatmap.cell.width/2}, 0) rotate(-45)")
    .style("text-anchor", "end")

d3.SpotMyGene.renderHeatmapCells = (parentContainer, cells, cellsData, params, sampleScale, geneScale) ->
  colorScale = d3.SpotMyGene.buildColorScale(cellsData)

  cells = cells.selectAll('rect')
    .data(cellsData, (d) -> "#{d.sampleId}-#{d.geneId}")

  cells
    .style('fill', (d) -> colorScale(d.value))
    .attr('x', (d) -> sampleScale(d.sampleId))
    .attr('y', (d) -> geneScale(d.geneId))
    .attr('width', params.heatmap.cell.width)
    .attr('height', params.heatmap.cell.height)

  cells.enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', (d) -> sampleScale(d.sampleId))
    .attr('y', (d) -> geneScale(d.geneId))
    .attr('width', params.heatmap.cell.width)
    .attr('height', params.heatmap.cell.height)
    .style('fill', (d) -> colorScale(d.value))
    .on 'mouseover', (d) ->
      d3.SpotMyGene.dispatch.cellMouseover(@, d)
    .on 'mouseout', (d) ->
      d3.SpotMyGene.dispatch.cellMouseout(@, d)

  cells.exit().remove()
