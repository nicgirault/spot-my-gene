d3.SpotMyGene.listenSampleMouseover = (element, params) ->
  if params.sampleLabels.showTooltips
    d3.SpotMyGene.sampleTip = d3.tip()
      .direction('s')
      .offset([20, 0])
      .html params.sampleLabels.tooltipContent

    element.call d3.SpotMyGene.sampleTip

    d3.SpotMyGene.dispatch.on 'sampleMouseover', (d, i, j) ->
      d3.SpotMyGene.sampleTip.attr('class', 'd3-tip appear').show(d)

    d3.SpotMyGene.dispatch.on 'sampleMouseout', (d, i, j) ->
      d3.SpotMyGene.sampleTip.attr('class', 'd3-tip').show(d)
      d3.SpotMyGene.sampleTip.hide()
