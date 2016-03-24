class d3.SpotMyGene.Labels
  resize = (container, params) ->
    text = container.selectAll 'text'

    cellHeight = params.height / text.data().length
    labelHeight = container.select 'text'
      .node().getBBox().height

    maxWidth = 0
    text.each (label) ->
      width = d3.select(@).node().getBBox().width
      if width > maxWidth
        maxWidth = width

    scale = d3.min [
      cellHeight / labelHeight
      params.width / maxWidth
    ]
    currentSize = parseFloat container.style 'font-size'
    container.style 'font-size', currentSize * scale

    container.selectAll 'text'
      .attr 'y', (d, i) ->
        labelHeight = d3.select(@).node().getBBox().height
        i * params.step + (labelHeight + cellHeight)/2


  constructor: (container, params) ->
    @container = container
    @params = params


  _render: (items, params) ->
    selection = @container
      .style 'font-size', params.fontSize
      .selectAll 'text'
      .data items, (item) -> item.id

    selection
      .text (d) -> d.id
      .attr 'x', params.width
      .style 'font-size', params.fontSize

    selection.exit().remove()

    selection.enter()
      .append 'text'
      .text (d) -> d.id
      .attr 'x', params.width
      .attr 'text-anchor', 'end'

    resize @container, params

    selection
