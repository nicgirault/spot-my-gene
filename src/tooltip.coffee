d3.SpotMyGene.addTooltips = (element, getContent) ->
  tip = d3.tip()
    .direction('s')
    .offset([20, 0])
    .html getContent
  element.call(tip)
    .on 'mouseover', (d) ->
      tip.attr('class', 'd3-tip appear').show(d)
    .on 'mouseout', (d) ->
       tip.attr('class', 'd3-tip').show(d)
       tip.hide()
