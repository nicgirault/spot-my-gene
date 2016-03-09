d3.SpotMyGene.varianceScaling = (data) ->
  for index, row of data.matrix
    mean = d3.mean row
    deviation = d3.deviation row
    data.matrix[index] = ((x - mean) / deviation for x in row)
