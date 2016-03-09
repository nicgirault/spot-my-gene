d3.SpotMyGene.euclideanDistance = (data, rowLabels, colLabels, type) ->
  distances = []

  if type is "col"
    for i in [0..colLabels.length-2]
      for j in [i+1..colLabels.length-1]
        val = 0
        for k in [0..rowLabels.length-1]
          val += Math.pow(data.matrix[k][i] - data.matrix[k][j], 2)
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
          val += Math.pow(data.matrix[i][k] - data.matrix[j][k], 2)

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

d3.SpotMyGene.buildMap = (elements, root) ->
  leaves = d3.SpotMyGene.leaves root

  map = d3.map()
  for elementIdx, element of elements
    for leafIdx, leaf of leaves
      if leaf.name is element.id
        map.set parseInt(elementIdx), parseInt(leafIdx)
        break
  map
