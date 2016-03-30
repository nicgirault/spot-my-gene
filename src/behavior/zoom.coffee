class d3.SpotMyGene.Zoom
  constructor: (svg, params, heatmap, geneLabels, sampleLabels) ->
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
      .on 'click', d3.SpotMyGene.geneZoom svg, params, heatmap, geneLabels, sampleLabels, geneZoom

    cells = svg.select '.cells-group'
    geneZoom.on 'zoom', d3.SpotMyGene.zoom svg, params, heatmap, geneLabels, sampleLabels, geneZoom

    geneZoom svg

    # disable zoom on scroll
    svg.on "wheel.zoom", null
    svg.on "mousewheel.zoom", null
    svg.on "MozMousePixelScroll.zoom", null

# avoid getting inconsistent scale or translation vectors
d3.SpotMyGene._moveChecker = (translateX, translateY, scale, params) ->
  scaleX = Math.min scale, params.zoom.maxCellWidth / params.heatmap.cell.width
  scaleX = 1 if scaleX < 1

  scaleY = Math.min scale, params.zoom.maxCellHeight / params.heatmap.cell.height
  scaleY = 1 if scaleY < 1

  maxX = (scaleX - 1) * params.heatmap.width
  maxY = (scaleY - 1) * params.heatmap.height

  if translateX > 0
    translateX = 0
  if translateY > 0
    translateY = 0
  if translateX < -maxX
    translateX = -maxX
  if translateY < -maxY
    translateY = -maxY

  [[translateX, translateY], [scaleX, scaleY]]

d3.SpotMyGene.geneZoom = (svg, params, heatmap, geneLabels, sampleLabels, behavior) ->
  ->
    point = (coordinates) ->
      scale = behavior.scale()
      translate = behavior.translate()
      [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]]
    coordinates = (point) ->
      scale = behavior.scale()
      translate = behavior.translate()
      [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale]

    # TODO: retirer le centre
    center0 = behavior.center()
    translate0 = behavior.translate()
    coordinates0 = coordinates center0
    scale = behavior.scale() * Math.pow(2, +@getAttribute('data-zoom-gene'))

    center1 = point coordinates0
    translateY = translate0[1] + center0[1] - center1[1]

    # svg.transition().duration(750).call zoom.event
    [translate, scale] = d3.SpotMyGene._moveChecker(
      0,
      translate0[1] + center0[1] - center1[1],
      scale,
      params
    )
    # reset translate vector
    behavior.translate translate
    behavior.scale scale[1]

    geneLabels.zoom scale[1], translate
    heatmap.zoom [1, scale[1]], translate

d3.SpotMyGene.zoom = (svg, params, heatmap, geneLabels, sampleLabels, behavior) ->
  ->
    [translate, scale] = d3.SpotMyGene._moveChecker(
      d3.event.translate[0],
      d3.event.translate[1],
      d3.event.scale,
      params
    )
    # reset translate vector
    behavior.translate translate

    geneLabels.zoom scale[1], [0, translate[1]]
    sampleLabels.zoom scale[0], [0, translate[0]]
    heatmap.zoom scale, translate
