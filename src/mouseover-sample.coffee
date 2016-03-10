d3.SpotMyGene.listenSampleMouseover = (element, params, data) ->
  if params.sampleLabels.showTooltips
    sampleByIds = {}
    for sample in data.samples
      sampleByIds[sample.id] = sample

    d3.SpotMyGene.sampleTip = d3.tip()
      .direction('s')
      .offset([20, 0])
      .html params.sampleLabels.tooltipContent

    element.call d3.SpotMyGene.sampleTip

    d3.SpotMyGene.dispatch.on 'sampleMouseover', (d, i, j) ->
      d3.SpotMyGene.sampleTip.attr('class', 'd3-tip appear').show(sampleByIds[d])

    d3.SpotMyGene.dispatch.on 'sampleMouseout', (d, i, j) ->
      d3.SpotMyGene.sampleTip.attr('class', 'd3-tip').show(sampleByIds[d])
      d3.SpotMyGene.sampleTip.hide()
