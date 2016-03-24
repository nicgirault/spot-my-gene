d3.SpotMyGene.zoom = (params, behavior) ->

  moveChecker = (translateX, translateY, scale, width, height) ->
    maxX = (scale - 1) * width
    maxY = (scale - 1) * height

    if translateX > 0
      translateX = 0
    if translateY > 0
      translateY = 0
    if translateX < -maxX
      translateX = -maxX
    if translateY < -maxY
      translateY = -maxY

    # reset zoom behavior translate vector
    behavior.translate([translateX, translateY])

    [translateX, translateY]

  return ->
    scale = d3.event.scale

    [translateX, translateY] = moveChecker(
      d3.event.translate[0],
      d3.event.translate[1],
      d3.event.scale,
      params.heatmap.width,
      params.heatmap.height
    )

    d3.select('.cells-group')
      .attr('transform', "translate(#{translateX}, #{translateY}) scale(#{scale}, #{scale})")

    d3.select('.x.axis')
      .attr('transform', "translate(#{translateX + params.heatmap.cell.height*scale/2}, 0) scale(#{scale})")

    d3.select('.y.axis')
      .attr('transform', "translate(0, #{translateY + params.heatmap.cell.height*scale/2}) scale(#{scale})")
