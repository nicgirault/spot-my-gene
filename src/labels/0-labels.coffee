class d3.SpotMyGene.Labels
  resize = (container, params) ->
    console.log params
    text = container.selectAll 'text'

    labelHeight = container.select 'text'
      .node().getBBox().height

    maxWidth = 0
    text.each (label) ->
      width = d3.select(@).node().getBBox().width
      if width > maxWidth
        maxWidth = width

    scale = d3.min [
      params.step / labelHeight
      params.width / maxWidth
    ]
    currentSize = parseFloat container.style 'font-size'
    container.style 'font-size', currentSize * scale

    if params.translate?
      container.attr 'transform', "translate(#{params.translate})"

    container.selectAll 'text'
      .attr 'y', (d, i) ->
        labelHeight = d3.select(@).node().getBBox().height
        i * params.step + (labelHeight + params.step)/2


  constructor: (container, params) ->
    @container = container
    @params = params

  zoom: (scale, translate) ->
    params =
      height: @params.heatmap.height
      width: @params.geneLabels.length
      step: @params.heatmap.cell.height * scale
      translate: translate
    resize @container, params

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
