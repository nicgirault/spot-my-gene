d3.SpotMyGene.SamplePie = (params) ->
  d3.SpotMyGene.Pie.call(@, params)

  d3.SpotMyGene.dispatch.on "updateSelectedSamples.pie#{@id}", (selectedGenes) =>
    @selectedObjectsBuffer = selectedGenes
    @render selectedGenes, @accessorBuffer

  @
