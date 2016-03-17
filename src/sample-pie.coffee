d3.SpotMyGene.SamplePie = (params, initialSamples) ->

  currentIds = []

  chart = c3.generate
    bindto: params.container
    data:
      columns: []
      type : 'pie'
    color:
      pattern: params.colors

  render = (samples, accessor) ->
    nest = d3.nest()
      .key accessor
      .sortKeys d3.ascending
      .entries samples

    newIds = (elt.key for elt in nest)
    idsToUnload = currentIds.filter (id) ->
      id not in newIds

    chart.load columns: ([elt.key, elt.values.length] for elt in nest)
    chart.unload ids: idsToUnload

    currentIds = newIds

  d3.SpotMyGene.dispatch.on 'updateSelectedSamples.samplePie', (selectedSamples) ->
    render selectedSamples, (sample) -> sample.summary.sx

  @render = render
  @
