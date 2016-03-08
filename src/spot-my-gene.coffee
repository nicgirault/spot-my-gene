d3.SpotMyGene = (data, params) ->
  instance = new d3.SpotMyGene.Core params
  d3.SpotMyGene.validateParams params, data
  instance.render2 data, params

d3.SpotMyGene.Core = (params) ->
  @params = params
  @

d3.SpotMyGene.validateParams = (params, data) ->
  heatmapWidth = params.width - params.geneLabels.length
  params.heatmap.cell.width = heatmapWidth / data.rows[0].values.length

  if params.maxHeight < params.heatmap.cell.height * data.rows.length
    params.heatmap.cell.height = params.maxHeight / data.rows.length

d3.SpotMyGene.dispatch = d3.dispatch(
  'geneMouseover',
  'sampleMouseover',
  'geneMouseout',
  'sampleMouseout'
  'cellMouseover'
  'cellMouseout'
)
