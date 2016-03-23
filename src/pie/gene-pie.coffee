d3.SpotMyGene.GenePie = (params) ->
  params = d3.SpotMyGene.defaults params, d3.SpotMyGene.pieDefaultParameters

  d3.SpotMyGene.Pie.call(@, params)

  d3.SpotMyGene.dispatch.on "updateSelectedGenes.pie#{@id}", (selectedGenes) =>
    @selectedObjectsBuffer = selectedGenes
    @render selectedGenes, @accessorBuffer

  if params.focusOnCellMouseover
    d3.SpotMyGene.dispatch.on "cellMouseover.pie#{@id}", (cell, d) =>
      gene = @map.get d.geneId
      if gene?
        targetId = @accessorBuffer gene
        @chart.focus targetId

    d3.SpotMyGene.dispatch.on "cellMouseout.pie#{@id}", (cell, d) =>
      gene = @map.get d.geneId
      if gene?
        @chart.focus()

  @
