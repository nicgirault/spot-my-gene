class d3.SpotMyGene.SampleLabels extends d3.SpotMyGene.Labels
  constructor: (params, parentElement) ->
    container = parentElement.select '.sample-labels'
      .append 'g'
      .attr 'class', 'axis'
    super container, params

  render: (samples) ->
    @selection = @_render samples
    @selection
      .attr 'text-anchor', 'start'
      .on 'mouseover.label', d3.SpotMyGene.dispatch.sampleMouseover
      .on 'mouseout.label', d3.SpotMyGene.dispatch.sampleMouseout
    d3.SpotMyGene.listenSampleMouseover @container, @params
