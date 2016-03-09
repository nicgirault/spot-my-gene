d3.SpotMyGene.Core.prototype.render = (svg, data, params) ->
  return unless data
  colorScale = d3.SpotMyGene.buildColorScale(data)

  rowLabel = (row.id for row in data.genes)
  colLabel = (col.name for col in data.samples)

  sampleRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, rowLabel, colLabel, "col"), colLabel);
  sampleMap = d3.SpotMyGene.buildMap(data.samples, sampleRoot)

  geneRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, rowLabel, colLabel, "row"), rowLabel);
  geneMap = d3.SpotMyGene.buildMap(data.genes, geneRoot)

  svg = d3.SpotMyGene.renderGeneLabels svg, data.genes, geneMap, params
  svg = d3.SpotMyGene.renderSampleLabels svg, data.samples, sampleMap, params

  d3.SpotMyGene.renderDendogram svg, sampleRoot, params

  cell = svg.select '.heatmap'
    .selectAll('g')
    .data data.matrix
    .enter()
    .append 'g'
    .selectAll('rect')
    .data (d) -> d
    .enter()
    .append('rect')
    .attr 'class', 'cell'
    .attr 'x', (d, i) ->
      sampleMap.get(i) * params.heatmap.cell.width
    .attr 'y', (d, i, j) ->
      geneMap.get(j) * params.heatmap.cell.height
    .attr('width', params.heatmap.cell.width)
    .attr('height', params.heatmap.cell.height)
    .style('margin-right', 2)
    .style 'fill', colorScale
    .on 'mouseover', (d, i, j) ->
      d3.SpotMyGene.dispatch.cellMouseover @, d, i, j
    .on 'mouseout', (d, i, j) ->
      d3.SpotMyGene.dispatch.cellMouseout @, d, i, j
