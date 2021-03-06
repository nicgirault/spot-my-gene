d3.SpotMyGene = (data, params) ->
  params = d3.SpotMyGene.Parameters params
  instance = new d3.SpotMyGene.Core params
  d3.SpotMyGene.preRender params, data
  instance.render2 data, params

d3.SpotMyGene.Core = (params) ->
  @params = params
  @

d3.SpotMyGene.preRender = (params, data) ->
  heatmapWidth = params.width - params.geneLabels.length - params.geneLabels.margin - params.geneDendogram.height - params.margins.left
  params.heatmap.cell.width = heatmapWidth / data.samples.length
  params.sampleDendogram.width = heatmapWidth
  params.heatmap.width = heatmapWidth

  if params.maxHeight < params.heatmap.cell.height * data.genes.length
    params.heatmap.cell.height = params.maxHeight / data.genes.length
  params.heatmap.height = params.heatmap.cell.height * data.genes.length

  params.geneDendogram.width = params.heatmap.height
  d3.SpotMyGene.defaultGeneLabelParameters params
  d3.SpotMyGene.defaultSampleLabelParameters params


  d3.SpotMyGene.varianceScaling data.cells

d3.SpotMyGene.defaultGeneLabelParameters = (params) ->
  params.geneLabels.height = params.heatmap.height
  params.geneLabels.width = params.geneLabels.length
  params.geneLabels.step = params.heatmap.cell.height
  params.geneLabels.fontSize = 13
  params.geneLabels.transform = ""

d3.SpotMyGene.defaultSampleLabelParameters = (params) ->
  params.sampleLabels.height = params.heatmap.width
  params.sampleLabels.width = params.sampleLabels.length
  params.sampleLabels.step = params.heatmap.cell.width
  params.sampleLabels.fontSize = 13
  params.sampleLabels.transform = "translate(0, -#{params.heatmap.cell.width/3}) rotate(45)"

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
