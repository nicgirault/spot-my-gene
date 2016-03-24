d3.SpotMyGene.Dendogram = (svg, params) ->
  cluster = d3.layout.cluster()
    .size [params.width, params.height]

  line = d3.svg.line()
    .x (d) -> d.x
    .y (d) -> d.y

  lineData = (d, i, j) ->
    points = [
      {x: d.source.x, y: d.source.y}
      {x: d.target.x, y: d.source.y}
      {x: d.target.x, y: d.target.y}
    ]
    line points

  @_render = (container, root) ->
    nodes = cluster.nodes root
    links = cluster.links nodes
    leaves = nodes.filter (node) -> not node.children?
    d3.SpotMyGene.resizeTree params.width, params.height, leaves.length, nodes[0]

    selection = container
      .selectAll '.link'
      .data links

    selection.exit().remove()

    selection.enter()
      .append 'path'
      .attr 'class', 'link'
      .attr 'd', lineData
      .on 'mouseover', (d) ->
        d3.SpotMyGene.addSubTreeClass d, nodes, selection, 'highlight'
      .on 'mouseout', (d) ->
        d3.SpotMyGene.removeSubTreeClass nodes, selection, 'highlight'

    [selection, nodes]
  @

d3.SpotMyGene.resizeTree = (width, height, leavesNumber, root) ->
  cellWidth = width / leavesNumber
  index = 0

  computeY = (value) ->
    height *( 1 - value / root.value)

  setNodeSize = (node) ->
    unless node.children?
      node.x = cellWidth * index + cellWidth/2
      index++
    else
      for child in node.children
        setNodeSize child
      if node.children.length is 1
        node.x = node.children[0].x
      else
        node.x = (node.children[0].x + node.children[1].x) / 2

    if node.value?
      node.y = computeY node.value
    else
      node.y = height

  setNodeSize root

d3.SpotMyGene.addSubTreeClass = (d, nodes, link, className) ->
  for node in nodes
    node[className] = false

  classChildNodes = (node) ->
    node[className] = true
    if node.children?
      classChildNodes(node.children[0])
      classChildNodes(node.children[1])

  classChildNodes(d.source)

  link.classed className, (d) ->
    d.target[className]

d3.SpotMyGene.removeSubTreeClass = (nodes, link, className) ->
  for node in nodes
    node[className] = false
  link.classed className, false
