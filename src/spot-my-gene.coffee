d3.SpotMyGene = (data, params) ->
  instance = new d3.SpotMyGene.Core params
  d3.SpotMyGene.preRender params, data
  instance.render2 data, params

d3.SpotMyGene.Core = (params) ->
  @params = params
  @

d3.SpotMyGene.preRender = (params, data) ->
  heatmapWidth = params.width - params.geneLabels.length - params.geneDendogram.height
  params.heatmap.cell.width = heatmapWidth / data.samples.length
  params.sampleDendogram.width = heatmapWidth
  params.heatmap.width = heatmapWidth

  if params.maxHeight < params.heatmap.cell.height * data.genes.length
    params.heatmap.cell.height = params.maxHeight / data.genes.length
  params.heatmap.height = params.heatmap.cell.height * data.genes.length

  d3.SpotMyGene.varianceScaling data.cells

d3.SpotMyGene.selectedSamples = []
d3.SpotMyGene.dispatch = d3.dispatch(
  'geneMouseover'
  'sampleMouseover'
  'geneMouseout'
  'sampleMouseout'
  'cellMouseover'
  'cellMouseout'
  'cellMouseout'
  'renderEnd'
  'updateSelectedSamples'
  'updateSelectedGenes'
  'genePieAccessorChanged'
)
