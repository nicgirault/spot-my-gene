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

  nodes = cluster.nodes tree[0]
  links = cluster.links nodes
  leaves = nodes.filter (node) -> node.name?

  d3.SpotMyGene.resizeTree width, leaves.length, nodes[0]

  svg.select '.sample-dendogram'
    # .attr 'width', width
    # .attr 'height', height
    .selectAll '.link'
    .data links
    .enter()
    .append 'path'
    .attr 'class', 'link'
    .attr 'd', lineData

d3.SpotMyGene.resizeTree = (width, leavesNumber, root) ->
  cellWidth = width / leavesNumber
  index = 0

  setNodeSize = (node) ->
    if node.name?
      node.x = cellWidth * index + cellWidth/2
      index++
    else
      for child in node.children
        setNodeSize child
      if node.children.length is 1
        node.x = node.children[0].x
      else
        node.x = (node.children[0].x + node.children[1].x) / 2

  setNodeSize root
