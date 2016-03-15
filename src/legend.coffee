d3.SpotMyGene.HeatmapLegend = (params) ->
  labelsHeight = params.labels.size

  svg = d3.select(params.container)
    .append 'svg'
    .style 'width', params.width
    .style 'height', params.height + labelsHeight

  legend = svg.append 'g'
    .attr 'class', 'legend-tills'

  @render = (colorScale) ->
    quantiles = colorScale.quantiles()

    selection = legend.selectAll 'rect'
      .data quantiles

    tillWidth = params.width / colorScale.range().length
    selection.enter()
      .append 'rect'
      .style 'fill', (d) -> colorScale(d)
      .attr 'x', (d, i) -> tillWidth * i
      .attr 'y', 0
      .attr 'width', tillWidth
      .attr 'height', params.height

    if params.labels?
      selection.enter()
        .append 'text'
        .attr 'class', 'mono'
        .text (d) -> "≥ #{d.toPrecision(params.labels.precision)}"
        .attr 'x', (d, i) -> tillWidth * i
        .attr 'y', params.height + labelsHeight
        .style 'font-size', params.labels.size
        .style 'fill', params.labels.color

  @
