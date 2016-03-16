d3.SpotMyGene.renderSampleLabels = (parentElement, scale, params, data) ->
  # axis = d3.svg.axis()
  #   .scale(scale)
  #   .orient('top')
  #
  # label = parentElement.select '.heatmap'
  #   .append('g')
  #   .attr('class', 'x axis')
  #   .call(axis)
  #   .selectAll('text')
  #   .attr('transform', "translate(#{params.heatmap.cell.width/3}, 0) rotate(-45)")
  #   .style('text-anchor', 'start')
  #   .on 'mouseover', (d, i, j) ->
  #     d3.SpotMyGene.dispatch.sampleMouseover d, i, j
  #   .on 'mouseout', (d, i, j) ->
  #     d3.SpotMyGene.dispatch.sampleMouseout d, i, j
  #
  # d3.SpotMyGene.listenSampleMouseover(label, params, data)
  # parentElement

d3.SpotMyGene.GeneLabels = (params, parentElement) ->

  geneLabels = parentElement.select '.gene-labels'
    .append 'g'
    .attr 'class', 'y axis'
    .attr 'transform', "translate(0, #{params.heatmap.cell.height / 2})"

  updateSelected = ->
    geneLabels.selectAll 'text'
      .classed 'selected', (d) -> d._selected

    selectedGenes = geneLabels.selectAll('text')
      .data()
      .filter (gene) -> gene._selected

    d3.SpotMyGene.dispatch.updateSelectedGenes selectedGenes

  render = (genes) ->
    selection = geneLabels.selectAll 'text'
      .data genes, (gene) -> gene.id

    selection
      .text (d) -> d.id
      .attr 'y', (d, i) -> i * params.heatmap.cell.height

    selection.enter()
      .append 'text'
      .text (d) -> d.id
      .attr 'x', 0
      .attr 'y', (d, i) -> i * params.heatmap.cell.height

    selection.exit().remove()

    d3.selectable geneLabels, geneLabels.selectAll('text'), updateSelected

  @render = render
  @
