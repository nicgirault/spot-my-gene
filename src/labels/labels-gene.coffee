class d3.SpotMyGene.GeneLabels extends d3.SpotMyGene.Labels
  constructor: (params, parentElement) ->
    container = parentElement.select '.gene-labels'
      .append 'g'
      .attr 'class', 'axis'
    super container, params

  render: (genes, params) ->
    container = @container

    d3.SpotMyGene.dispatch.on 'updateSelectedGenes.labels', (selectedGenes, fromLabel) ->
      ids = (gene.id for gene in selectedGenes)
      unless fromLabel
        container.selectAll 'text'
          .each (d) -> d._selected = d.id in ids
          .classed 'selected', (d) -> d._selected

    updateSelected = ->
      container.selectAll 'text'
        .classed 'selected', (d) -> d._selected

      selectedGenes = container.selectAll('text')
        .data()
        .filter (gene) -> gene._selected

      d3.SpotMyGene.dispatch.updateSelectedGenes selectedGenes, true

    params = @params
    params =
      height: params.heatmap.height
      width: params.geneLabels.length
      step: params.heatmap.cell.height
      fontSize: 13
    selection = @_render genes, params
    d3.selectable container, selection, updateSelected
