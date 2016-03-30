d3.SpotMyGene._labelResize = (container, params) ->
  text = container.selectAll 'text'

  labelHeight = container.select 'text'
    .node().getBBox().height

  maxWidth = 0
  text.each (label) ->
    width = d3.select(@).node().getBBox().width
    maxWidth = width if width > maxWidth

  scale = d3.min [
    params.step / labelHeight
    params.width / maxWidth
  ]
  currentSize = parseFloat container.style 'font-size'
  container.style 'font-size', currentSize * scale

  if params.translate?
    container.attr 'transform', "translate(#{params.translate})"

  container.selectAll 'text'
    .attr 'transform', (d, i) ->
      labelHeight = d3.select(@).node().getBBox().height
      offset = i * params.step + (labelHeight + params.step)/2
      "translate(0, #{offset}) #{params.transform}"

class d3.SpotMyGene.Labels

  constructor: (container, params) ->
    @container = container
    @params = params

  zoom: (scale, translate) ->
    # clone
    params = {}
    for key, value of @params
      params[key] = value

    params.step = params.step * scale
    params.translate = translate

    d3.SpotMyGene._labelResize @container, params

  _render: (items) ->
    selection = @container
      .style 'font-size', @params.fontSize
      .selectAll 'text'
      .data items, (item) -> item.id

    selection.exit().remove()

    selection.enter()
      .append 'text'
      .text (d) -> d.id

    d3.SpotMyGene._labelResize @container, @params

    selection
