d3.SpotMyGene.buildColorScale = (cells) ->
  colors = [
    '#005824', '#1A693B', '#347B53', '#4F8D6B', '#699F83', '#83B09B',
    '#9EC2B3', '#B8D4CB', '#D2E6E3', '#EDF8FB', '#FFFFFF', '#F1EEF6',
    '#E6D3E1', '#DBB9CD', '#D19EB9', '#C684A4', '#BB6990', '#B14F7C',
    '#A63467', '#9B1A53', '#91003F'
  ]

  d3.scale.quantile()
    .domain d3.extent cells, (cell) -> cell.value
    .range colors
