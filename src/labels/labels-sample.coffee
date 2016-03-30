class d3.SpotMyGene.SampleLabels extends d3.SpotMyGene.Labels
  constructor: (params, parentElement) ->
    container = parentElement.select '.sample-labels'
      .append 'g'
      .attr 'class', 'axis'
    super container, params

  render: (samples) ->
    container = @container

    d3.SpotMyGene.dispatch.on 'updateSelectedSamples.labels', (selectedSamples, fromLabel) ->
      ids = (sample.id for sample in selectedSamples)
      unless fromLabel
        container.selectAll 'text'
          .each (d) -> d._selected = d.id in ids
          .classed 'selected', (d) -> d._selected

    updateSelected = ->
      container.selectAll 'text'
        .classed 'selected', (d) -> d._selected

      selectedSamples = container.selectAll('text')
        .data()
        .filter (sample) -> sample._selected

      d3.SpotMyGene.dispatch.updateSelectedSamples selectedSamples, true

    selection = @_render samples

    selection
      .attr 'text-anchor', 'start'
      .on 'mouseover.label', d3.SpotMyGene.dispatch.sampleMouseover
      .on 'mouseout.label', d3.SpotMyGene.dispatch.sampleMouseout
    d3.selectable container, selection, updateSelected
    d3.SpotMyGene.listenSampleMouseover container, @params
