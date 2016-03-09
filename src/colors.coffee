d3.SpotMyGene.buildColorScale = (data) ->
  colors = [
    '#005824', '#1A693B', '#347B53', '#4F8D6B', '#699F83', '#83B09B',
    '#9EC2B3', '#B8D4CB', '#D2E6E3', '#EDF8FB', '#FFFFFF', '#F1EEF6',
    '#E6D3E1', '#DBB9CD', '#D19EB9', '#C684A4', '#BB6990', '#B14F7C',
    '#A63467', '#9B1A53', '#91003F'
  ]
  values = []
  for row in data.rows
    for value in row.values
      values.push value
  d3.scale.quantile()
    .domain d3.extent values
    .range colors
