d3.SpotMyGene.euclideanDistance = (data, rowLabels, colLabels, type) ->
  distances = []

  matrix = buildMatrix = (data) ->
    samplesIdx = {}
    genesIdx = {}
    for idx, sample of data.samples
      samplesIdx[sample.id] = idx
    for idx, gene of data.genes
      genesIdx[gene.id] = idx

    matrix = ([0] for row in data.genes)
    for cell in data.cells
      matrix[genesIdx[cell.geneId]][samplesIdx[cell.sampleId]] = cell.value

  buildMatrix(data)

  if type is "col"
    for i in [0..colLabels.length-2]
      for j in [i+1..colLabels.length-1]
        val = 0
        for k in [0..rowLabels.length-1]
          val += Math.pow(matrix[k][i] - matrix[k][j], 2)
        val = Math.sqrt(val)
        distances.push({
          row:colLabels[i],
          col:colLabels[j],
          value:+val
        })

  else if type is "row"
    for i in [0..rowLabels.length-2]
      for j in [i+1..rowLabels.length-1]
        val = 0
        for k in [0..colLabels.length-1]
          val += Math.pow(matrix[i][k] - matrix[j][k], 2)

        val = Math.sqrt(val)
        distances.push({
          row:rowLabels[i],
          col:rowLabels[j],
          value:+val
        })
  distances

# https://en.wikipedia.org/wiki/UPGMA
d3.SpotMyGene.clusteringUPGMA = (distances, labels) ->
  minMatrix = (matrix) ->
    min = d3.min matrix, (elt) -> elt.value

    for i, elt of matrix
      if elt.value is min
        return [i, elt]

  mergeDistances = (a, b, distances) ->
    mergedDistances = []
    buffer = {}
    for i, d of distances
      if d.row not in [a, b] and d.col not in [a, b]
        mergedDistances.push d
        continue

      if d.row not in [a, b]
        if buffer[d.row]?
          mergedDistances.push
            row: d.row
            col: a + ',' + b
            value: (buffer[d.row] + d.value) / 2
        else
          buffer[d.row] = d.value
        continue

      if d.col not in [a, b]
        if buffer[d.col]?
          mergedDistances.push
            row: a + ',' + b
            col: d.col
            value: (buffer[d.col] + d.value) / 2
        else
          buffer[d.col] = d.value
        continue
    mergedDistances

  clusters = ({name: label} for index, label of labels)

  while distances.length > 0
    [i, distance] = minMatrix distances
    distances.splice i, 1
    distances = mergeDistances distance.row, distance.col, distances

    children = clusters.filter (cluster) ->
      cluster.name in [distance.row, distance.col]
    clusters = clusters.filter (cluster) ->
      cluster.name not in [distance.row, distance.col]
    clusters.push
      name: distance.row + ',' + distance.col
      value: distance.value
      children: children

  clusters[0]

d3.SpotMyGene.leaves = (root) ->
  leaves = []

  getName = (node) ->
    if node.children?
      getName node.children[0]
      getName node.children[1]
    else
      leaves.push node

  getName root
  leaves

# deprecated
d3.SpotMyGene.getRange = (elements, root) ->
  leaves = d3.SpotMyGene.leaves root

  range = []
  for elementIdx, element of elements
    for leafIdx, leaf of leaves
      if leaf.name is element.name
        range.push parseInt(leafIdx)
        break
  range

d3.SpotMyGene.sortByCluster = (elements, root) ->
  leaves = d3.SpotMyGene.leaves root

  for elementIdx, element of elements
    for leafIdx, leaf of leaves
      if leaf.name is element.name
        element.idx = parseInt(leafIdx)
        break
  elements.sort (a, b) ->
    d3.ascending a.idx, b.idx
