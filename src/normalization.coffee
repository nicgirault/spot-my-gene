d3.SpotMyGene.varianceScaling = (cells) ->
  nest = d3.nest()
    .key (cell) -> cell.geneId
    .entries(cells)

  for geneCells in nest
    mean = d3.mean geneCells.values, (cell) -> cell.value
    deviation = d3.deviation geneCells.values, (cell) -> cell.value
    for cell in geneCells.values
      cell.value = (cell.value - mean) / deviation
