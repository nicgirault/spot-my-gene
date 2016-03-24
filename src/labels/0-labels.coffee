class d3.SpotMyGene.Labels
  constructor: (container, params) ->
    @container = container
    @params = params

  _render: (items, params) ->
    selection = @container.selectAll 'text'
      .data items, (item) -> item.id

    selection
      .text (d) -> d.id
      .attr 'x', params.width
      .attr 'y', (d, i) -> i * params.step + params.outerPadding
      .style 'font-size', params.fontSize

    selection.enter()
      .append 'text'
      .text (d) -> d.id
      .attr 'x', params.width
      .attr 'y', (d, i) -> i * params.step + params.outerPadding
      .attr 'text-anchor', 'end'
      .style 'font-size', params.fontSize

    selection.exit().remove()

    selection
