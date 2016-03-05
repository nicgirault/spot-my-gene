d3.SpotMyGene.renderColumnsLabels = (parentElement, columns, params) ->
  if parentElement.select('.columns-labels').empty()
    container = parentElement.append('g')
      .attr('class', 'columns-labels')
      .attr('transform', 'translate(' + params.margins.left + ',' + params.margins.top + ')')

    label = container.selectAll('.label')
      .data(columns)
      .enter()
      .append('text')
      .text (d) -> d.name
      .attr('x', 0)
      .attr 'y', (d, i) ->
        i * params.cell.width
      .style('text-anchor', 'left')
      .attr('transform', 'translate(' + params.cell.width / 1.5 + ',-6) rotate (-90)')

    if params.columns.labels.showTooltips
      d3.SpotMyGene.addTooltips label, params.columns.labels.tooltipContent

  parentElement

d3.SpotMyGene.renderRowsLabels = (parentElement, rows, params) ->
  if parentElement.select('.rows-labels').empty()
    container = parentElement.append('g')
      .attr('class', 'rows-labels')
      .attr('transform', 'translate(' + params.margins.left + ',' + params.margins.top + ')')

    label = container.selectAll('.label')
      .data(rows)
      .enter()
      .append('text')
      .text (d) -> d.id
      .attr('x', 0)
      .attr 'y', (d, i) ->
        i * params.cell.height
      .style('text-anchor', 'end')
      .attr("transform", "translate(-6," + params.cell.height / 1.5 + ")")


    if params.rows.labels.showTooltips
      d3.SpotMyGene.addTooltips label, params.rows.labels.tooltipContent

  parentElement
