d3.SpotMyGene.SampleLabels = (params, parentElement) ->

  sampleLabels = parentElement.select '.sample-labels'
    .append 'g'
    .attr 'class', 'x axis'

  updateSelected = ->
    sampleLabels.selectAll 'text'
      .classed 'selected', (d) -> d._selected

    selectedSamples = sampleLabels.selectAll 'text'
      .data()
      .filter (sample) -> sample._selected

    d3.SpotMyGene.dispatch.updateSelectedSamples selectedSamples

  render = (samples) ->
    selection = sampleLabels.selectAll 'text'
      .data samples, (sample) -> sample.id

    selection
      .text (d) -> d.id
      .attr 'x', (d, i) -> i * params.heatmap.cell.width

    selection.enter()
      .append 'text'
      .text (d) -> d.id
      .attr 'text-anchor', 'middle'
      .attr 'transform', (d, i) ->
        "translate(#{params.heatmap.cell.width * i + params.heatmap.cell.width/2}, #{params.sampleLabels.length/2}) rotate(-45)"
      .on 'mouseover.label', d3.SpotMyGene.dispatch.sampleMouseover
      .on 'mouseout.label', d3.SpotMyGene.dispatch.sampleMouseout

    selection.exit().remove()

    d3.selectable sampleLabels, sampleLabels.selectAll('text'), updateSelected
    d3.SpotMyGene.listenSampleMouseover sampleLabels, params


  @render = render
  @

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
