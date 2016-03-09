d3.SpotMyGene.Core.prototype.render = (svg, data, params) ->
  return unless data
  colorScale = d3.SpotMyGene.buildColorScale(data)

  svg = d3.SpotMyGene.renderRowsLabels svg, data.rows, params
  svg = d3.SpotMyGene.renderColumnsLabels svg, data.columns, params

  tree = [
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
    ]
  ]
  inlineData = []
  rowLabel = (row.id for row in data.rows)
  colLabel = (col.name for col in data.columns)
  clusterPatients = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, rowLabel, colLabel, "col"), colLabel);
  console.log clusterPatients
  # clusterGenes = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, rowLabel, colLabel, "row"), rowLabel);

  d3.SpotMyGene.renderDendogram svg, clusterPatients, params

  cell = svg.select '.heatmap'
    .selectAll('g')
    .data data.rows
    .enter()
    .append 'g'
    .selectAll('rect')
    .data (d) -> d.values
    .enter()
    .append('rect')
    .attr 'class', 'cell'
    .attr 'x', (d, i) -> i * params.heatmap.cell.width
    .attr 'y', (d, i, j) -> j * params.heatmap.cell.height
    .attr('width', params.heatmap.cell.width)
    .attr('height', params.heatmap.cell.height)
    .style('margin-right', 2)
    .style 'fill', colorScale
    .on 'mouseover', (d, i, j) ->
      d3.SpotMyGene.dispatch.cellMouseover @, d, i, j
    .on 'mouseout', (d, i, j) ->
      d3.SpotMyGene.dispatch.cellMouseout @, d, i, j
