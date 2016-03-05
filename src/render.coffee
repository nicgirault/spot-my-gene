d3.SpotMyGene.Core.prototype.render = (data, params) ->
  svg = d3.select(params.container)
    .append 'svg'
    .style 'width', params.width
  svg.selectAll('*').remove()

  return unless data

  svg.style('height', params.cell.height * data.rows.length + params.columns.labels.height)

  colorScale = d3.SpotMyGene.buildColorScale()

  svg = d3.SpotMyGene.renderRowsLabels svg, data.rows, params
  svg = d3.SpotMyGene.renderColumnsLabels svg, data.columns, params

  cell = svg.append('g')
    .attr('transform', 'translate(' + params.rows.labels.width + ',' + params.columns.labels.height + ')')
    .selectAll('g')
    .data data.rows
    .enter()
    .append 'g'
    .selectAll('rect')
    .data (d) -> d.values
    .enter()
    .append('rect')
    .attr 'class', 'cell'
    .attr 'x', (d, i) -> i * params.cell.width
    .attr 'y', (d, i, j) -> j * params.cell.height
    .attr('width', params.cell.width)
    .attr('height', params.cell.height)
    .style('margin-right', 2)
    .style 'fill', colorScale

  # hightlightOnMouseover cell, params
