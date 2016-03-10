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

  d3.SpotMyGene.renderGeneLabels(svg, geneScale, params, data)

  # draw = ->
  #   svg.select("g.y.axis").call(yAxis)

  # zoom = d3.behavior.zoom()
  #   .on "zoom", draw
  #   .scaleExtent([1, 32])
  #   .x sampleScale
  #   .y geneScale

  d3.SpotMyGene.renderDendogram svg, sampleRoot, params
  cell = svg.select '.heatmap'
    .selectAll('rect')
    .data data.cells
    .enter()
    .append('rect')
    .attr 'class', 'cell'
    .attr 'x', (d) ->
      sampleScale(d.sampleId)
    .attr 'y', (d) ->
      geneScale(d.geneId)
    .attr('width', params.heatmap.cell.width)
    .attr('height', params.heatmap.cell.height)
    # .call(zoom)
    .style 'fill', (d) ->
      colorScale d.value
    .on 'mouseover', (d) ->
      d3.SpotMyGene.dispatch.cellMouseover @, d
    .on 'mouseout', (d) ->
      d3.SpotMyGene.dispatch.cellMouseout @, d
