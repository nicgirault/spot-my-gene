d3.SpotMyGene.HeatmapLegend = (params) ->
  labelsHeight = params.labels.size

  svg = d3.select(params.container)
    .append 'svg'
    .style 'width', params.width
    .style 'height', params.height + labelsHeight

  legend = svg.append 'g'
    .attr 'class', 'legend-tills'

  @render = (colorScale) ->
    domain = colorScale.domain()
    quantiles = (domain[0] + i * (domain[2] - domain[0]) / (params.size-1) for i in [0...params.size])
    selection = legend.selectAll 'rect'
      .data quantiles

    tillWidth = params.width / params.size
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
