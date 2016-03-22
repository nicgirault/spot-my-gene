d3.SpotMyGene.GeneDendogram = (svg, params) ->
  d3.SpotMyGene.Dendogram.call @, svg, params

  @render = (root, genes) =>
    container = svg.select '.gene-dendogram'

    [selection, nodes] = @_render container, root

    selection.on 'click', (d) ->
      selectedLeaves = d3.SpotMyGene.leaves(d.source)
      d3.SpotMyGene.addSubTreeClass(d, nodes, selection, 'active')
      names = (leaf.name for leaf in selectedLeaves)
      selectedGenes = genes.filter (gene) ->
        gene.id in names
      d3.SpotMyGene.dispatch.updateSelectedGenes selectedGenes, 'dendogram'

    d3.SpotMyGene.dispatch.on 'updateSelectedGenes.dendogram', (selectedGenes, source) ->
      unless source is 'dendogram'
        d3.SpotMyGene.removeSubTreeClass(root, selection, 'active')
  @
