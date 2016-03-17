d3.SpotMyGene.Core.prototype.render = (svg, data, params) ->
  return unless data

  geneIds = (gene.id for gene in data.genes)
  sampleIds = (sample.id for sample in data.samples)

  sampleRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "col"), sampleIds)
  d3.SpotMyGene.sortByCluster(data.samples, sampleRoot)

  geneRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "row"), geneIds)
  d3.SpotMyGene.sortByCluster(data.genes, geneRoot)

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
    .domain (sample.id for sample in data.samples)
    .range (i * params.heatmap.cell.width for i of data.samples)

  geneScale = d3.scale.ordinal()
    .domain (gene.id for gene in data.genes)
    .range (i * params.heatmap.cell.height for i of data.genes)

  cells = svg.select('.heatmap')
    .append('g')
    .attr('class', 'cells-group')

  colorScale = d3.SpotMyGene.buildColorScale(data.cells)
  legend = new d3.SpotMyGene.HeatmapLegend(params.legend)
  legend.render(colorScale)

  d3.SpotMyGene.renderDendogram svg, sampleRoot, data.samples, params
  d3.SpotMyGene.renderHeatmapCells(svg, cells, data.cells, params, sampleScale, geneScale)

  geneLabels = new d3.SpotMyGene.GeneLabels params, svg
  geneLabels.render data.genes

  sampleLabels = new d3.SpotMyGene.SampleLabels params, svg
  sampleLabels.render data.samples

  samplePie = new d3.SpotMyGene.SamplePie(params.samplePie, data.samples)
  samplePie.render data.samples, (sample) -> sample.summary.sx

  genePie = new d3.SpotMyGene.GenePie(params.genePie, data.genes)
  genePie.render data.genes, (gene) ->
    return 'Protein coding' if gene.id[gene.id.length-1] is "1"
    return 'Hormone' if gene.id[gene.id.length-1] is "2"
    return 'Marker' if gene.id[gene.id.length-1] is "3"
    return 'SiRNA' if gene.id[gene.id.length-1] is "4"
    return 'Cell cycle' if gene.id[gene.id.length-1] is "5"
    return 'Transcription factor' if gene.id[gene.id.length-1] is "6"
    return 'Antigen' if gene.id[gene.id.length-1] is "7"
    return 'Adhesion molecule' if gene.id[gene.id.length-1] is "8"
    return 'Ribozyme' if gene.id[gene.id.length-1] is "9"
    return 'Growth factor' if gene.id[gene.id.length-1] is "0"
    return "Unknown"

  d3.SpotMyGene.dispatch.renderEnd()
