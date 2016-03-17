d3.SpotMyGene.GenePie = (params, initialGenes) ->

  currentIds = []
  selectedGenesBuffer = initialGenes
  accessorBuffer = params.accessor

  chart = c3.generate
    bindto: params.container
    data:
      columns: []
      type : 'pie'
    color:
      pattern: params.colors

  render = (genes, accessor) ->
    nest = d3.nest()
      .key accessor
      .sortKeys d3.ascending
      .entries genes

    newIds = (elt.key for elt in nest)
    idsToUnload = currentIds.filter (id) ->
      id not in newIds

    chart.load columns: ([elt.key, elt.values.length] for elt in nest)
    chart.unload ids: idsToUnload

    currentIds = newIds

  d3.SpotMyGene.dispatch.on 'updateSelectedGenes.pie', (selectedGenes) ->
    selectedGenesBuffer = selectedGenes
    render selectedGenes, accessorBuffer

  d3.SpotMyGene.dispatch.on 'genePieAccessorChanged.pie', (accessor) ->
    accessorBuffer = accessor
    render selectedGenesBuffer, accessor

  @render = render
  @
