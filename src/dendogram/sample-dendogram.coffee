d3.SpotMyGene.SampleDendogram = (svg, params) ->
  d3.SpotMyGene.Dendogram.call @, svg, params

  @render = (root, samples) =>
    container = svg.select '.sample-dendogram'
    [selection, nodes] = @_render container, root

    selection.on 'click', (d) ->
      selectedLeaves = d3.SpotMyGene.leaves(d.source)
      d3.SpotMyGene.addSubTreeClass(d, nodes, selection, 'active')
      names = (leaf.name for leaf in selectedLeaves)
      selectedSamples = samples.filter (sample) ->
        sample.id in names
      d3.SpotMyGene.dispatch.updateSelectedSamples selectedSamples, 'dendogram'

    d3.SpotMyGene.dispatch.on 'updateSelectedSamples.dendogram', (selectedSamples, source) ->
      unless source is 'dendogram'
        d3.SpotMyGene.removeSubTreeClass(root, selection, 'active')
  @
