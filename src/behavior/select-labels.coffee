d3.SpotMyGene.labelSelect = (geneLabels, sampleLabels) ->

  onSelectionUpdate = (container) ->
    (selected, source) ->
      ids = (d.id for d in selected)
      unless source == 'label'
        container.selectAll 'text'
          .each (d) -> d._selected = d.id in ids
          .classed 'selected', (d) -> d._selected

  updateSelected = (container, event) ->
    ->
      container.selectAll 'text'
        .classed 'selected', (d) -> d._selected

      selected = container.selectAll('text')
        .data()
        .filter (d) -> d._selected

      event selected, 'label'

  d3.SpotMyGene.dispatch.on 'updateSelectedGenes.labels', onSelectionUpdate(geneLabels.container)
  d3.SpotMyGene.dispatch.on 'updateSelectedSamples.labels', onSelectionUpdate(sampleLabels.container)

  d3.SpotMyGene.selectable(
    geneLabels.container,
    geneLabels.selection,
    updateSelected(geneLabels.container, d3.SpotMyGene.dispatch.updateSelectedGenes)
  )
  d3.SpotMyGene.selectable(
    sampleLabels.container,
    sampleLabels.selection,
    updateSelected(sampleLabels.container, d3.SpotMyGene.dispatch.updateSelectedSamples)
  )
