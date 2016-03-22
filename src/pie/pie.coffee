d3.SpotMyGene._pieCount = 0

d3.SpotMyGene.Pie = (params) ->
  defaultParams =
    container: ''
    colors: d3.scale.category20().range()

  params = d3.SpotMyGene.defaults params, defaultParams

  @id = d3.SpotMyGene._pieCount
  d3.SpotMyGene._pieCount++

  currentIds = []
  @selectedObjectsBuffer = null
  @accessorBuffer = null

  chart = c3.generate
    bindto: params.container
    data:
      columns: []
      type : 'pie'
    color:
      pattern: params.colors

  render = (objects, accessor) =>
    @selectedObjectsBuffer = objects
    @accessorBuffer = accessor
    nest = d3.nest()
      .key accessor
      .sortKeys d3.ascending
      .entries objects

    newIds = (elt.key for elt in nest)
    idsToUnload = currentIds.filter (id) ->
      id not in newIds

    chart.load columns: ([elt.key, elt.values.length] for elt in nest)
    chart.unload ids: idsToUnload

    currentIds = newIds

  @dispatch = d3.dispatch 'accessorChanged'
  @dispatch.on 'accessorChanged', (accessor) =>
    @accessorBuffer = accessor
    @render @selectedObjectsBuffer, accessor

  @render = render
  @
