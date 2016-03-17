d3.SpotMyGene.GenePie = (params, initialGenes) ->

  currentIds = []
  console.log
  chart = c3.generate
    bindto: params.container
    data:
      columns: []
      type : 'pie'
    color:
      pattern: params.colors
      # onclick: (d, i) -> console.log("onclick", d, i)
      # onmouseover: (d, i) -> console.log("onmouseover", d, i)
      # onmouseout: (d, i) -> console.log("onmouseout", d, i)

  render = (genes, accessor) ->
    nest = d3.nest()
      .key accessor
      .sortKeys d3.ascending
      .entries genes

    newIds = (elt.key for elt in nest)
    idsToUnload = currentIds.filter (id) ->
      id not in newIds

    chart.load columns: ([elt.key, elt.values.length] for elt in nest)
    chart.unload ids: idsToUnload

    currentIds = newIds

  d3.SpotMyGene.dispatch.on 'updateSelectedGenes.pie', (selectedGenes) ->
    render selectedGenes, (gene, i) ->
      return 'Protein coding' if gene.id[gene.id.length-1] is "1"
      return 'Hormone' if gene.id[gene.id.length-1] is "2"
      return 'Marker' if gene.id[gene.id.length-1] is "3"
      return 'SiRNA' if gene.id[gene.id.length-1] is "4"
      return 'Cell cycle' if gene.id[gene.id.length-1] is "5"
      return 'Transcription factor' if gene.id[gene.id.length-1] is "6"
      return 'Antigen' if gene.id[gene.id.length-1] is "7"
      return 'Adhesion molecule' if gene.id[gene.id.length-1] is "8"
      return 'Ribozyme' if gene.id[gene.id.length-1] is "9"
      return 'Growth factor' if gene.id[gene.id.length-1] is "0"
      return "Unknown"

  @render = render
  @
