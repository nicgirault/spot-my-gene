d3.SpotMyGene = function(data, params) {
  var instance;
  instance = new d3.SpotMyGene.Core(params);
  d3.SpotMyGene.preRender(params, data);
  return instance.render2(data, params);
};

d3.SpotMyGene.Core = function(params) {
  this.params = params;
  return this;
};

d3.SpotMyGene.preRender = function(params, data) {
  var heatmapWidth;
  heatmapWidth = params.width - params.geneLabels.length - params.geneDendogram.height;
  params.heatmap.cell.width = heatmapWidth / data.samples.length;
  params.sampleDendogram.width = heatmapWidth;
  if (params.maxHeight < params.heatmap.cell.height * data.genes.length) {
    params.heatmap.cell.height = params.maxHeight / data.genes.length;
  }
  return d3.SpotMyGene.varianceScaling(data);
};

d3.SpotMyGene.dispatch = d3.dispatch('geneMouseover', 'sampleMouseover', 'geneMouseout', 'sampleMouseout', 'cellMouseover', 'cellMouseout');

d3.SpotMyGene.listenGeneMouseover = function(element, params) {
  if (params.geneLabels.showTooltips) {
    d3.SpotMyGene.geneTip = d3.tip().direction('s').offset([20, 0]).html(params.geneLabels.tooltipContent);
    element.call(d3.SpotMyGene.geneTip);
    d3.SpotMyGene.dispatch.on('geneMouseover', function(d, i, j) {
      return d3.SpotMyGene.geneTip.attr('class', 'd3-tip appear').show(d);
    });
    return d3.SpotMyGene.dispatch.on('geneMouseout', function(d, i, j) {
      d3.SpotMyGene.geneTip.attr('class', 'd3-tip').show(d);
      return d3.SpotMyGene.geneTip.hide();
    });
  }
};

d3.SpotMyGene.listenSampleMouseover = function(element, params) {
  if (params.sampleLabels.showTooltips) {
    d3.SpotMyGene.sampleTip = d3.tip().direction('s').offset([20, 0]).html(params.sampleLabels.tooltipContent);
    element.call(d3.SpotMyGene.sampleTip);
    d3.SpotMyGene.dispatch.on('sampleMouseover', function(d, i, j) {
      return d3.SpotMyGene.sampleTip.attr('class', 'd3-tip appear').show(d);
    });
    return d3.SpotMyGene.dispatch.on('sampleMouseout', function(d, i, j) {
      d3.SpotMyGene.sampleTip.attr('class', 'd3-tip').show(d);
      return d3.SpotMyGene.sampleTip.hide();
    });
  }
};

d3.SpotMyGene.dispatch.on('cellMouseover', function(cell, d, i, j) {
  d3.select(cell).classed('active', true);
  d3.select(".sample-labels text:nth-child(" + (i + 1) + ")").classed('active', true);
  return d3.select(".gene-labels text:nth-child(" + (j + 1) + ")").classed('active', true);
});

d3.SpotMyGene.dispatch.on('cellMouseout', function(cell, d, i, j) {
  d3.select(cell).classed('active', false);
  d3.select(".sample-labels text:nth-child(" + (i + 1) + ")").classed('active', false);
  return d3.select(".gene-labels text:nth-child(" + (j + 1) + ")").classed('active', false);
});

d3.SpotMyGene.buildColorScale = function(data) {
  var colors, l, len, len1, m, ref, row, value, values;
  colors = ['#005824', '#1A693B', '#347B53', '#4F8D6B', '#699F83', '#83B09B', '#9EC2B3', '#B8D4CB', '#D2E6E3', '#EDF8FB', '#FFFFFF', '#F1EEF6', '#E6D3E1', '#DBB9CD', '#D19EB9', '#C684A4', '#BB6990', '#B14F7C', '#A63467', '#9B1A53', '#91003F'];
  values = [];
  ref = data.matrix;
  for (l = 0, len = ref.length; l < len; l++) {
    row = ref[l];
    for (m = 0, len1 = row.length; m < len1; m++) {
      value = row[m];
      values.push(value);
    }
  }
  return d3.scale.quantile().domain(d3.extent(values)).range(colors);
};

d3.SpotMyGene.renderSampleLabels = function(parentElement, samples, sampleMap, params) {
  var container, label;
  container = parentElement.select('.sample-labels');
  label = container.selectAll('.label').data(samples).enter().append('text').text(function(d) {
    return d.name;
  }).attr('x', 0).attr('y', function(d, i) {
    return sampleMap.get(i) * params.heatmap.cell.width;
  }).style('text-anchor', 'left').attr('transform', 'translate(' + params.heatmap.cell.width / 2 + ',-6) rotate (-90)').on('mouseover', function(d, i, j) {
    return d3.SpotMyGene.dispatch.sampleMouseover(d, i, j);
  }).on('mouseout', function(d, i, j) {
    return d3.SpotMyGene.dispatch.sampleMouseout(d, i, j);
  });
  d3.SpotMyGene.listenSampleMouseover(label, params);
  return parentElement;
};

d3.SpotMyGene.renderGeneLabels = function(parentElement, genes, geneMap, params) {
  var container, label;
  container = parentElement.select('.gene-labels');
  label = container.selectAll('.label').data(genes).enter().append('text').attr('class', 'label').text(function(d) {
    return d.id;
  }).attr('x', 0).attr('y', function(d, i) {
    return geneMap.get(i) * params.heatmap.cell.height;
  }).style('text-anchor', 'end').attr("transform", "translate(-6," + params.heatmap.cell.height / 1.5 + ")").on('mouseover', function(d, i, j) {
    return d3.SpotMyGene.dispatch.geneMouseover(d, i, j);
  }).on('mouseout', function(d, i, j) {
    return d3.SpotMyGene.dispatch.geneMouseout(d, i, j);
  });
  d3.SpotMyGene.listenGeneMouseover(label, params);
  return parentElement;
};

d3.SpotMyGene.euclideanDistance = function(data, rowLabels, colLabels, type) {
  var distances, i, j, k, l, m, n, o, p, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, val;
  distances = [];
  if (type === "col") {
    for (i = l = 0, ref = colLabels.length - 2; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
      for (j = m = ref1 = i + 1, ref2 = colLabels.length - 1; ref1 <= ref2 ? m <= ref2 : m >= ref2; j = ref1 <= ref2 ? ++m : --m) {
        val = 0;
        for (k = n = 0, ref3 = rowLabels.length - 1; 0 <= ref3 ? n <= ref3 : n >= ref3; k = 0 <= ref3 ? ++n : --n) {
          val += Math.pow(data.matrix[k][i] - data.matrix[k][j], 2);
        }
        val = Math.sqrt(val);
        distances.push({
          row: colLabels[i],
          col: colLabels[j],
          value: +val
        });
      }
    }
  } else if (type === "row") {
    for (i = o = 0, ref4 = rowLabels.length - 2; 0 <= ref4 ? o <= ref4 : o >= ref4; i = 0 <= ref4 ? ++o : --o) {
      for (j = p = ref5 = i + 1, ref6 = rowLabels.length - 1; ref5 <= ref6 ? p <= ref6 : p >= ref6; j = ref5 <= ref6 ? ++p : --p) {
        val = 0;
        for (k = q = 0, ref7 = colLabels.length - 1; 0 <= ref7 ? q <= ref7 : q >= ref7; k = 0 <= ref7 ? ++q : --q) {
          val += Math.pow(data.matrix[i][k] - data.matrix[j][k], 2);
        }
        val = Math.sqrt(val);
        distances.push({
          row: rowLabels[i],
          col: rowLabels[j],
          value: +val
        });
      }
    }
  }
  return distances;
};

d3.SpotMyGene.clusteringUPGMA = function(distances, labels) {
  var children, clusters, distance, i, index, label, mergeDistances, minMatrix, ref;
  minMatrix = function(matrix) {
    var elt, i, min;
    min = d3.min(matrix, function(elt) {
      return elt.value;
    });
    for (i in matrix) {
      elt = matrix[i];
      if (elt.value === min) {
        return [i, elt];
      }
    }
  };
  mergeDistances = function(a, b, distances) {
    var buffer, d, i, mergedDistances, ref, ref1, ref2, ref3;
    mergedDistances = [];
    buffer = {};
    for (i in distances) {
      d = distances[i];
      if (((ref = d.row) !== a && ref !== b) && ((ref1 = d.col) !== a && ref1 !== b)) {
        mergedDistances.push(d);
        continue;
      }
      if ((ref2 = d.row) !== a && ref2 !== b) {
        if (buffer[d.row] != null) {
          mergedDistances.push({
            row: d.row,
            col: a + ',' + b,
            value: (buffer[d.row] + d.value) / 2
          });
        } else {
          buffer[d.row] = d.value;
        }
        continue;
      }
      if ((ref3 = d.col) !== a && ref3 !== b) {
        if (buffer[d.col] != null) {
          mergedDistances.push({
            row: a + ',' + b,
            col: d.col,
            value: (buffer[d.col] + d.value) / 2
          });
        } else {
          buffer[d.col] = d.value;
        }
        continue;
      }
    }
    return mergedDistances;
  };
  clusters = (function() {
    var results;
    results = [];
    for (index in labels) {
      label = labels[index];
      results.push({
        name: label
      });
    }
    return results;
  })();
  while (distances.length > 0) {
    ref = minMatrix(distances), i = ref[0], distance = ref[1];
    distances.splice(i, 1);
    distances = mergeDistances(distance.row, distance.col, distances);
    children = clusters.filter(function(cluster) {
      var ref1;
      return (ref1 = cluster.name) === distance.row || ref1 === distance.col;
    });
    clusters = clusters.filter(function(cluster) {
      var ref1;
      return (ref1 = cluster.name) !== distance.row && ref1 !== distance.col;
    });
    clusters.push({
      name: distance.row + ',' + distance.col,
      children: children
    });
  }
  return clusters[0];
};

d3.SpotMyGene.leaves = function(root) {
  var getName, leaves;
  leaves = [];
  getName = function(node) {
    if (node.children != null) {
      getName(node.children[0]);
      return getName(node.children[1]);
    } else {
      return leaves.push(node);
    }
  };
  getName(root);
  return leaves;
};

d3.SpotMyGene.buildMap = function(elements, root) {
  var element, elementIdx, leaf, leafIdx, leaves, map;
  leaves = d3.SpotMyGene.leaves(root);
  map = d3.map();
  for (elementIdx in elements) {
    element = elements[elementIdx];
    for (leafIdx in leaves) {
      leaf = leaves[leafIdx];
      if (leaf.name === element.name) {
        map.set(parseInt(elementIdx), parseInt(leafIdx));
        break;
      }
    }
  }
  return map;
};

d3.SpotMyGene.Core.prototype.render = function(svg, data, params) {
  var cell, col, colLabel, colorScale, geneMap, geneRoot, row, rowLabel, sampleMap, sampleRoot;
  if (!data) {
    return;
  }
  colorScale = d3.SpotMyGene.buildColorScale(data);
  rowLabel = (function() {
    var l, len, ref, results;
    ref = data.genes;
    results = [];
    for (l = 0, len = ref.length; l < len; l++) {
      row = ref[l];
      results.push(row.id);
    }
    return results;
  })();
  colLabel = (function() {
    var l, len, ref, results;
    ref = data.samples;
    results = [];
    for (l = 0, len = ref.length; l < len; l++) {
      col = ref[l];
      results.push(col.name);
    }
    return results;
  })();
  sampleRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, rowLabel, colLabel, "col"), colLabel);
  sampleMap = d3.SpotMyGene.buildMap(data.samples, sampleRoot);
  geneRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, rowLabel, colLabel, "row"), rowLabel);
  geneMap = d3.SpotMyGene.buildMap(data.genes, geneRoot);
  svg = d3.SpotMyGene.renderGeneLabels(svg, data.genes, geneMap, params);
  svg = d3.SpotMyGene.renderSampleLabels(svg, data.samples, sampleMap, params);
  d3.SpotMyGene.renderDendogram(svg, sampleRoot, params);
  return cell = svg.select('.heatmap').selectAll('g').data(data.matrix).enter().append('g').selectAll('rect').data(function(d) {
    return d;
  }).enter().append('rect').attr('class', 'cell').attr('x', function(d, i) {
    return sampleMap.get(i) * params.heatmap.cell.width;
  }).attr('y', function(d, i, j) {
    return geneMap.get(j) * params.heatmap.cell.height;
  }).attr('width', params.heatmap.cell.width).attr('height', params.heatmap.cell.height).style('margin-right', 2).style('fill', colorScale).on('mouseover', function(d, i, j) {
    return d3.SpotMyGene.dispatch.cellMouseover(this, d, i, j);
  }).on('mouseout', function(d, i, j) {
    return d3.SpotMyGene.dispatch.cellMouseout(this, d, i, j);
  });
};

d3.SpotMyGene.Core.prototype.render2 = function(data, params) {
  var heatmap, svg;
  svg = d3.select(params.container).append('svg').style('width', params.width).style('height', params.heatmap.cell.height * data.genes.length + params.sampleLabels.length + params.sampleDendogram.height + params.margins.top);
  svg.selectAll('*').remove();
  svg.append('g').attr('class', 'sample-dendogram').attr('transform', "translate(" + (params.margins.left + params.geneLabels.length + params.geneDendogram.height) + ", 0)");
  svg.append('g').attr('class', 'gene-dendogram');
  heatmap = svg.append('g').attr('class', 'heatmap-with-labels').attr('transform', "translate(" + (params.margins.left + params.geneDendogram.height) + ", " + (params.margins.top + params.sampleDendogram.height) + ")");
  heatmap.append('g').attr('class', 'sample-labels').attr('transform', "translate(" + params.geneLabels.length + ", " + params.sampleLabels.length + ")");
  heatmap.append('g').attr('class', 'gene-labels').attr('transform', "translate(" + params.geneLabels.length + ", " + params.sampleLabels.length + ")");
  heatmap.append('g').attr('class', 'heatmap').attr('transform', "translate(" + params.geneLabels.length + ", " + params.sampleLabels.length + ")");
  return this.render(svg, data, params);
};

d3.SpotMyGene.renderDendogram = function(svg, tree, params) {
  var cluster, height, leaves, line, lineData, links, nodes, width;
  width = params.sampleDendogram.width;
  height = params.sampleDendogram.height;
  cluster = d3.layout.cluster().size([width, height]);
  line = d3.svg.line().x(function(d) {
    return d.x;
  }).y(function(d) {
    return d.y;
  });
  lineData = function(d, i, j) {
    var points;
    points = [
      {
        x: d.source.x,
        y: d.source.y
      }, {
        x: d.target.x,
        y: d.source.y
      }, {
        x: d.target.x,
        y: d.target.y
      }
    ];
    return line(points);
  };
  nodes = cluster.nodes(tree);
  links = cluster.links(nodes);
  leaves = nodes.filter(function(node) {
    return node.name != null;
  });
  d3.SpotMyGene.resizeTree(width, leaves.length, nodes[0]);
  return svg.select('.sample-dendogram').selectAll('.link').data(links).enter().append('path').attr('class', 'link').attr('d', lineData);
};

d3.SpotMyGene.resizeTree = function(width, leavesNumber, root) {
  var cellWidth, index, setNodeSize;
  cellWidth = width / leavesNumber;
  index = 0;
  setNodeSize = function(node) {
    var child, l, len, ref;
    if (node.name != null) {
      node.x = cellWidth * index + cellWidth / 2;
      return index++;
    } else {
      ref = node.children;
      for (l = 0, len = ref.length; l < len; l++) {
        child = ref[l];
        setNodeSize(child);
      }
      if (node.children.length === 1) {
        return node.x = node.children[0].x;
      } else {
        return node.x = (node.children[0].x + node.children[1].x) / 2;
      }
    }
  };
  return setNodeSize(root);
};

d3.SpotMyGene.varianceScaling = function(data) {
  var deviation, index, mean, ref, results, row, x;
  ref = data.matrix;
  results = [];
  for (index in ref) {
    row = ref[index];
    mean = d3.mean(row);
    deviation = d3.deviation(row);
    results.push(data.matrix[index] = (function() {
      var l, len, results1;
      results1 = [];
      for (l = 0, len = row.length; l < len; l++) {
        x = row[l];
        results1.push((x - mean) / deviation);
      }
      return results1;
    })());
  }
  return results;
};
