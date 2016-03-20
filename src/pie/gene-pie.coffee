d3.SpotMyGene.GenePie = (params) ->
  d3.SpotMyGene.Pie.call(@, params)

  d3.SpotMyGene.dispatch.on "updateSelectedGenes.pie#{@id}", (selectedGenes) =>
    @selectedObjectsBuffer = selectedGenes
    @render selectedGenes, @accessorBuffer

  @
