d3.SpotMyGene.varianceScaling = (data) ->
  for row in data.rows
    mean = d3.mean row.values
    deviation = d3.deviation row.values
    row.values = ((x - mean) / deviation for x in row.values)
