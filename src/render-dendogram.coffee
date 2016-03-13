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

  link = svg.select '.sample-dendogram'
    .selectAll '.link'
    .data links

  link.enter()
    .append 'path'
    .attr 'class', 'link'
    .attr 'd', lineData
    .on 'click', (d) ->
      d3.SpotMyGene.selectChildLeaves d, d3.SpotMyGene.selectedSamples
      d3.SpotMyGene.addSubTreeClass(d, nodes, link, 'active')
    .on 'mouseover', (d) ->
      d3.SpotMyGene.addSubTreeClass(d, nodes, link, 'highlight')
    .on 'mouseout', (d) ->
      d3.SpotMyGene.removeSubTreeClass(nodes, link, 'highlight')

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

d3.SpotMyGene.selectChildLeaves = (d, store) ->
  return unless d.target?
  store = d3.SpotMyGene.leaves(d.target)

d3.SpotMyGene.addSubTreeClass = (d, nodes, link, className) ->
  for node in nodes
    node[className] = false

  classChildNodes = (node) ->
    node[className] = true
    if node.children?
      classChildNodes(node.children[0])
      classChildNodes(node.children[1])

  classChildNodes(d.target)

  link.classed className, (d) ->
    d.target[className]

d3.SpotMyGene.removeSubTreeClass = (nodes, link, className) ->
  for node in nodes
    node[className] = false

  link.classed className, false
