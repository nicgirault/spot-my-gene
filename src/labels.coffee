d3.SpotMyGene.renderColumnsLabels = (parentElement, columns, params) ->
  container = parentElement.select '.sample-labels'

  label = container.selectAll('.label')
    .data(columns)
    .enter()
    .append('text')
    .text (d) -> d.name
    .attr('x', 0)
    .attr 'y', (d, i) ->
      i * params.heatmap.cell.width
    .style('text-anchor', 'left')
    .attr('transform', 'translate(' + params.heatmap.cell.width / 2 + ',-6) rotate (-90)')
    .on 'mouseover', (d, i, j) ->
      d3.SpotMyGene.dispatch.sampleMouseover d, i, j
    .on 'mouseout', (d, i, j) ->
      d3.SpotMyGene.dispatch.sampleMouseout d, i, j

  d3.SpotMyGene.listenSampleMouseover(label, params)

  parentElement

d3.SpotMyGene.renderRowsLabels = (parentElement, rows, params) ->
  container = parentElement.select '.gene-labels'

  label = container.selectAll('.label')
    .data(rows)
    .enter()
    .append('text')
    .attr 'class', 'label'
    .text (d) -> d.id
    .attr('x', 0)
    .attr 'y', (d, i) ->
      i * params.heatmap.cell.height
    .style('text-anchor', 'end')
    .attr("transform", "translate(-6," + params.heatmap.cell.height / 1.5 + ")")
    .on 'mouseover', (d, i, j) ->
      d3.SpotMyGene.dispatch.geneMouseover d, i, j
    .on 'mouseout', (d, i, j) ->
      d3.SpotMyGene.dispatch.geneMouseout d, i, j

  d3.SpotMyGene.listenGeneMouseover(label, params)

  parentElement
