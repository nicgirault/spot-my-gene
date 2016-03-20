geneAccessors =
  type: (gene) ->
    return 'Protein coding' if gene.id[gene.id.length - 1] == '1'
    return 'Hormone' if gene.id[gene.id.length - 1] == '2'
    return 'Marker' if gene.id[gene.id.length - 1] == '3'
    return 'SiRNA' if gene.id[gene.id.length - 1] == '4'
    return 'Cell cycle' if gene.id[gene.id.length - 1] == '5'
    if gene.id[gene.id.length - 1] == '6'
      return 'Transcription factor'
    if gene.id[gene.id.length - 1] == '7'
      return 'Antigen'
    if gene.id[gene.id.length - 1] == '8'
      return 'Adhesion molecule'
    if gene.id[gene.id.length - 1] == '9'
      return 'Ribozyme'
    if gene.id[gene.id.length - 1] == '0'
      return 'Growth factor'
    'Unknown'
  tag: (gene) ->
    if gene.id[gene.id.length - 1] == '1'
      return 'tag A'
    if gene.id[gene.id.length - 1] == '2'
      return 'tag A'
    if gene.id[gene.id.length - 1] == '3'
      return 'tag A'
    if gene.id[gene.id.length - 1] == '4'
      return 'tag B'
    if gene.id[gene.id.length - 1] == '5'
      return 'tag B'
    if gene.id[gene.id.length - 1] == '6'
      return 'tag C'
    if gene.id[gene.id.length - 1] == '7'
      return 'tag D'
    if gene.id[gene.id.length - 1] == '8'
      return 'tag D'
    if gene.id[gene.id.length - 1] == '9'
      return 'tag D'
    if gene.id[gene.id.length - 1] == '0'
      return 'No tag'
    'Unknown'

genePie = new d3.SpotMyGene.GenePie
  container: '#gene-pie'

samplePie = new d3.SpotMyGene.SamplePie
  container: '#sample-pie'

genePieAccessorChange = (value) ->
  genePie.dispatch.accessorChanged geneAccessors[value]


d3.json 'raw-data.json', (data) ->
  async.map data.st.samplesorder, ((sampleId, done) ->
    d3.json 'samples/' + sampleId + '.json', done
  ), (err, samples) ->
    cells = undefined
    formatedData = undefined
    geneId = undefined
    genes = undefined
    i = undefined
    key = undefined
    len = undefined
    ref = undefined
    ref1 = undefined
    row = undefined
    sample = undefined
    sampleIdx = undefined
    value = undefined
    i = 0
    len = samples.length
    while i < len
      sample = samples[i]
      sample.id = sample.name
      i++
    genes = do ->
      results = undefined
      results = []
      for key of data.ct
        `key = key`
        results.push
          id: key
          name: key
          metadata: yolo: 'value'
      results
    cells = []
    ref = data.ct
    for geneId of ref
      `geneId = geneId`
      row = ref[geneId]
      ref1 = row.count
      for sampleIdx of ref1
        `sampleIdx = sampleIdx`
        value = ref1[sampleIdx]
        cells.push
          geneId: geneId
          sampleId: samples[sampleIdx].id
          value: value
    formatedData =
      samples: samples
      genes: genes
      cells: cells
    d3.SpotMyGene formatedData, {}
    genePie.render genes, geneAccessors.type
    samplePie.render samples, (sample) -> sample.summary.sx
