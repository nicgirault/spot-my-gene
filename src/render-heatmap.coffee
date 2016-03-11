d3.SpotMyGene.Core.prototype.render = (svg, data, params) ->
  return unless data
  colorScale = d3.SpotMyGene.buildColorScale(data.cells)

  geneIds = (gene.id for gene in data.genes)
  sampleIds = (sample.id for sample in data.samples)

  sampleRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "col"), sampleIds)
  samplesOrder = d3.SpotMyGene.getRange(data.samples, sampleRoot)

  geneRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "row"), geneIds)
  genesOrder = d3.SpotMyGene.getRange(data.genes, geneRoot)

  sampleScale = d3.scale.ordinal()
    .domain(sampleIds)
    .range (idx * params.heatmap.cell.width for idx in samplesOrder)

  d3.SpotMyGene.renderSampleLabels(svg, sampleScale, params, data)

  geneScale = d3.scale.ordinal()
    .domain(geneIds)
    .range (idx * params.heatmap.cell.height for idx in genesOrder)

  # d3.SpotMyGene.renderGeneLabels(svg, geneScale, params, data)

  geneLabels = svg.select '.heatmap'
    .append('g')
    .attr('class', 'y axis')
    .attr("transform", "translate(-6," + params.heatmap.cell.height / 1.5 + ")")
    .style('text-anchor', 'end')

  d3.SpotMyGene.renderDendogram svg, sampleRoot, params
  zoomLevel = 1
  zoom = (event) ->
    if params.heatmap.cell.height * d3.event.scale < 30
      updateHeatmap d3.event.scale

  cells = svg.select '.heatmap'
    .selectAll('rect')
    .data data.cells

  cells.enter()
    .append('rect')
    .attr 'class', 'cell'
    .attr 'x', (d) ->
      sampleScale(d.sampleId)
    .attr('width', params.heatmap.cell.width)
    .style 'fill', (d) ->
      colorScale d.value
    .on 'mouseover', (d) ->
      d3.SpotMyGene.dispatch.cellMouseover @, d
    .on 'mouseout', (d) ->
      d3.SpotMyGene.dispatch.cellMouseout @, d
    .call d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom)

  geneAxis = d3.svg.axis().orient('left')

  updateHeatmap = (zoomLevel) ->
    cells
      .attr 'y', (d) ->
        geneScale(d.geneId) * zoomLevel
      .attr('height', params.heatmap.cell.height * zoomLevel)

    scale = geneScale.copy().range geneScale.range().map (i) -> i * zoomLevel
    geneAxis.scale(scale)

    geneLabels.call(geneAxis)

  updateHeatmap 1
