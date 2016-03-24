d3.SpotMyGene.SampleLabels = (params, parentElement) ->

  sampleLabels = parentElement.select '.sample-labels'
    .append 'g'
    .attr 'class', 'x axis'

  d3.SpotMyGene.dispatch.on 'updateSelectedSamples.labels', (selectedSamples, fromLabel) ->
    ids = (gene.id for gene in selectedSamples)
    unless fromLabel
      sampleLabels.selectAll 'text'
        .each (d) -> d._selected = d.id in ids
        .classed 'selected', (d) -> d._selected

  updateSelected = ->
    sampleLabels.selectAll 'text'
      .classed 'selected', (d) -> d._selected

    selectedSamples = sampleLabels.selectAll 'text'
      .data()
      .filter (sample) -> sample._selected

    d3.SpotMyGene.dispatch.updateSelectedSamples selectedSamples, true

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
