d3.SpotMyGene.Core.prototype.render = (svg, data, params) ->
  return unless data

  geneIds = (gene.id for gene in data.genes)
  sampleIds = (sample.id for sample in data.samples)

  sampleRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "col"), sampleIds)
  samplesOrder = d3.SpotMyGene.getRange(data.samples, sampleRoot)

  geneRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "row"), geneIds)
  genesOrder = d3.SpotMyGene.getRange(data.genes, geneRoot)

  d3.SpotMyGene.renderDendogram svg, sampleRoot, params

  # zoom = d3.behavior.zoom()
  #   .scaleExtent([1, 8])
  #
  # if params.enableZoom
  #   zoom.on('zoom', d3.SpotMyGene.zoom(params, zoom))

  filterBySample = (cells, samples) ->
    selectedIds = samples.map (sample) -> sample.name

    data.cells.filter (cell) ->
      cell.sampleId in selectedIds

  sampleScale = d3.scale.ordinal()
    .domain(sampleIds)
    .range (idx * params.heatmap.cell.width for idx in samplesOrder)

  geneScale = d3.scale.ordinal()
    .domain(geneIds)
    .range (idx * params.heatmap.cell.height for idx in genesOrder)

  sampleLabels = svg.select '.sample-labels'
    .append('g')
    .attr('class', 'x axis')

  geneLabels = svg.select '.gene-labels'
    .append('g')
    .attr('class', 'y axis')
    .attr("transform", "translate(0, #{params.heatmap.cell.height / 2})")

  cells = svg.select('.heatmap')
    .append('g')
    .attr('class', 'cells-group')

  d3.SpotMyGene.dispatch.on 'updateSelectedSamples', (root, samples) ->
    samplesOrder = d3.SpotMyGene.getRange(samples, root)
    params.heatmap.cell.width = params.heatmap.width / samples.length
    sampleScale = d3.scale.ordinal()
      .domain (sample.name for sample in samples)
      .range (idx * params.heatmap.cell.width for idx in samplesOrder)
    d3.SpotMyGene.renderHeatmapAxes(geneLabels, sampleLabels, geneScale, sampleScale, params)
    cellsData = filterBySample(data.cells, samples)
    d3.SpotMyGene.renderHeatmapCells(svg, cells, cellsData, params, sampleScale, geneScale)

  d3.SpotMyGene.renderHeatmapAxes(geneLabels, sampleLabels, geneScale, sampleScale, params)
  d3.SpotMyGene.renderHeatmapCells(svg, cells, data.cells, params, sampleScale, geneScale)

  d3.SpotMyGene.dispatch.renderEnd()
