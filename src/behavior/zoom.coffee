class d3.SpotMyGene.Zoom
  constructor: (svg, params, heatmap, geneLabels) ->
    # TODO: ne garder qu'un behavior
    zoom = d3.behavior.zoom()
      .scaleExtent [1, 8]
      .center [params.heatmap.width / 2, params.heatmap.height / 2]
      .size [params.heatmap.width, params.heatmap.height]

    geneZoom = d3.behavior.zoom()
      .scaleExtent [1, 8]
      .center [0, params.heatmap.height / 2]
      .size [params.heatmap.width, params.heatmap.height]

    d3.selectAll 'button[data-zoom-gene]'
      .on 'click', d3.SpotMyGene.geneZoom svg, params, heatmap, geneLabels, geneZoom

    cells = svg.select '.cells-group'
    geneZoom.on 'zoom', d3.SpotMyGene.zoom svg, params, heatmap, geneLabels, geneZoom

    geneZoom svg
    cells.on "wheel.zoom", null
    cells.on "mousewheel.zoom", null
    cells.on "MozMousePixelScroll.zoom", null

# avoid getting inconsistent scale or translation vectors
d3.SpotMyGene._moveChecker = (translateX, translateY, scale, params) ->
  # TODO: reparer le translate négatif
  # TODO: scaleX and scaleY
  scale = 1 if scale < 1
  scale = Math.min scale, params.zoom.maxCellHeight / params.heatmap.cell.height

  maxX = (scale - 1) * params.heatmap.width
  maxY = (scale - 1) * params.heatmap.height

  if translateX > 0
    translateX = 0
  if translateY > 0
    translateY = 0
  if translateX < -maxX
    translateX = -maxX
  if translateY < -maxY
    translateY = -maxY

  [[translateX, translateY], scale]

d3.SpotMyGene.geneZoom = (svg, params, heatmap, geneLabels, zoom) ->
  ->
    point = (coordinates) ->
      scale = zoom.scale()
      translate = zoom.translate()
      [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]]
    coordinates = (point) ->
      scale = zoom.scale()
      translate = zoom.translate()
      [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale]

    # TODO: retirer le centre
    center0 = zoom.center()
    translate0 = zoom.translate()
    coordinates0 = coordinates center0
    scale = zoom.scale() * Math.pow(2, +@getAttribute('data-zoom-gene'))

    center1 = point coordinates0
    translateY = translate0[1] + center0[1] - center1[1]

    # svg.transition().duration(750).call zoom.event
    [translate, scale] = d3.SpotMyGene._moveChecker(
      0,
      translate0[1] + center0[1] - center1[1],
      scale,
      params
    )
    zoom.scale scale
    zoom.translate translate

    geneLabels.zoom scale, translate
    heatmap.zoom [1, scale], translate

d3.SpotMyGene.zoom = (svg, params, heatmap, geneLabels, behavior) ->
  ->
    [translate, scale] = d3.SpotMyGene._moveChecker(
      d3.event.translate[0],
      d3.event.translate[1],
      d3.event.scale,
      params
    )
    svg.select('.x.axis')
      .attr('transform', "translate(#{translate}) scale(#{scale})")

    geneLabels.zoom scale, translate
    heatmap.zoom [scale, scale], translate
