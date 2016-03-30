d3.SpotMyGene.Core.prototype.render = (svg, data, params) ->
  return unless data

  geneIds = (gene.id for gene in data.genes)
  sampleIds = (sample.id for sample in data.samples)

  sampleRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "col"), sampleIds)
  d3.SpotMyGene.sortByCluster(data.samples, sampleRoot)

  geneRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "row"), geneIds)
  d3.SpotMyGene.sortByCluster(data.genes, geneRoot, true)

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

  sampleDendogram = new d3.SpotMyGene.SampleDendogram svg, params.sampleDendogram
  sampleDendogram.render sampleRoot, data.samples

  geneDendogram = new d3.SpotMyGene.GeneDendogram svg, params.geneDendogram
  geneDendogram.render geneRoot, data.genes

  heatmap = new d3.SpotMyGene.Heatmap(svg, data.cells, params.heatmap, sampleScale, geneScale)

  legend = new d3.SpotMyGene.HeatmapLegend(params.legend)
  legend.render(heatmap.colorScale)

  geneLabels = new d3.SpotMyGene.GeneLabels params.geneLabels, svg
  geneLabels.render data.genes

  sampleLabels = new d3.SpotMyGene.SampleLabels params.sampleLabels, svg
  sampleLabels.render data.samples

  if params.zoom?.enabled
    d3.SpotMyGene.Zoom svg, params, heatmap, geneLabels, sampleLabels

  d3.SpotMyGene.dispatch.renderEnd()
