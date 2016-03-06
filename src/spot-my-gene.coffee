d3.SpotMyGene = (data, params) ->
  instance = new d3.SpotMyGene.Core params
  d3.SpotMyGene.validateParams params, data
  instance.render data, params

d3.SpotMyGene.Core = (params) ->
  @params = params
  @

d3.SpotMyGene.validateParams = (params, data) ->
  heatmapWidth = params.width - params.rows.labels.width
  params.cell.width = heatmapWidth / data.rows[0].values.length

  if params.maxHeight < params.cell.height * data.rows.length
    params.cell.height = params.maxHeight / data.rows.length

d3.SpotMyGene.dispatch = d3.dispatch(
  'geneMouseover',
  'sampleMouseover',
  'geneMouseout',
  'sampleMouseout'
)
