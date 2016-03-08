d3.SpotMyGene.listenGeneMouseover = (element, params) ->
  if params.geneLabels.showTooltips
    d3.SpotMyGene.geneTip = d3.tip()
      .direction('s')
      .offset([20, 0])
      .html params.geneLabels.tooltipContent

    element.call d3.SpotMyGene.geneTip

    d3.SpotMyGene.dispatch.on 'geneMouseover', (d, i, j) ->
      d3.SpotMyGene.geneTip.attr('class', 'd3-tip appear').show(d)

    d3.SpotMyGene.dispatch.on 'geneMouseout', (d, i, j) ->
      d3.SpotMyGene.geneTip.attr('class', 'd3-tip').show(d)
      d3.SpotMyGene.geneTip.hide()
