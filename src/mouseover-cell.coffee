d3.SpotMyGene.dispatch.on 'cellMouseover', (cell, d, i, j) ->
  d3.select(cell).classed('active', true)
  d3.select(".columns-labels text:nth-child(#{i+1})")
    .classed 'active', true
  d3.select(".rows-labels text:nth-child(#{j+1})")
    .classed 'active', true

d3.SpotMyGene.dispatch.on 'cellMouseout', (cell, d, i, j) ->
  d3.select(cell).classed('active', false)
  d3.select(".columns-labels text:nth-child(#{i+1})")
    .classed 'active', false
  d3.select(".rows-labels text:nth-child(#{j+1})")
    .classed 'active', false
