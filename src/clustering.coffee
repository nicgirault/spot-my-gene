data = [
  children: [
    children: [
      children: [
        name: 'A'
      ,
        name: 'B'
      ]
    ,
      children: [
        name: 'C'
      ,
        name: 'D'
      ]
    ]
  ,
    children: [
      children: [
        name: 'E'
      ,
        name: 'F'
      ]
    ,
      children: [
        name: 'G'
      ,
        name: 'H'
      ]
    ]
  ]
]

clusterCol = d3.layout.cluster()
  .size([400, 200]);

lineCol = d3.svg.line()
  .x (d) -> d.x
  .y (d) -> d.y

lineDataCol = (d) ->
  points = [
      {x: d.source.x, y: d.source.y},
      {x: d.target.x, y: d.source.y},
      {x: d.target.x, y: d.target.y}
  ]
  lineCol(points)

nodesCol = clusterCol.nodes(data[0])
linksCol = clusterCol.links(nodesCol)

dendCol = d3.select("#cluster").append("svg")
  .attr("id", "svg_dendCol")
  .attr("width", 420)
  .attr("height", 210)
  .append("g")
  # .attr("transform", "translate(" + (margin.left-5) + ", 0)");

linkCol = dendCol.append("g")
  .attr("class", "dendCols")
  .selectAll(".linkColg")
  .data(linksCol)
  .enter()
  .append("path")
  .attr("class", "link")
  .attr("d", lineDataCol)
  .attr 'id', (d) -> 'colNode_id-'+parseInt(d.target.x)+'-'+parseInt(d.target.y)
