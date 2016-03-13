d3.SpotMyGene.renderDendogram = (svg, tree, params) ->
  width = params.sampleDendogram.width
  height = params.sampleDendogram.height

  cluster = d3.layout.cluster()
    .size [width, height]

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

  nodes = cluster.nodes tree
  links = cluster.links nodes
  leaves = nodes.filter (node) -> not node.children?

  d3.SpotMyGene.resizeTree width, height, leaves.length, nodes[0]

  svg.select '.sample-dendogram'
    # .attr 'width', width
    # .attr 'height', height
    .selectAll '.link'
    .data links
    .enter()
    .append 'path'
    .attr 'class', 'link'
    .attr 'd', lineData

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
