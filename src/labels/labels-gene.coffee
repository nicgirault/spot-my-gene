class d3.SpotMyGene.GeneLabels extends d3.SpotMyGene.Labels
  constructor: (params, parentElement) ->
    container = parentElement.select '.gene-labels'
      .append 'g'
      .attr 'class', 'axis'
    super container, params

  render: (genes) ->
    @selection = @_render genes
    @selection.attr 'text-anchor', 'end'
