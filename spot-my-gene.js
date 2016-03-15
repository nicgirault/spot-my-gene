var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
  params.heatmap.width = heatmapWidth;
  if (params.maxHeight < params.heatmap.cell.height * data.genes.length) {
    params.heatmap.cell.height = params.maxHeight / data.genes.length;
  }
  params.heatmap.height = params.heatmap.cell.height * data.genes.length;
  return d3.SpotMyGene.varianceScaling(data.cells);
};

d3.SpotMyGene.selectedSamples = [];

d3.SpotMyGene.dispatch = d3.dispatch('geneMouseover', 'sampleMouseover', 'geneMouseout', 'sampleMouseout', 'cellMouseover', 'cellMouseout', 'cellMouseout', 'renderEnd', 'updateSelectedSamples');

d3.SpotMyGene.listenGeneMouseover = function(element, params, data) {
  var gene, geneByIds, l, len, ref;
  if (params.geneLabels.showTooltips) {
    geneByIds = {};
    ref = data.genes;
    for (l = 0, len = ref.length; l < len; l++) {
      gene = ref[l];
      geneByIds[gene.id] = gene;
    }
    d3.SpotMyGene.geneTip = d3.tip().direction('s').offset([20, 0]).html(params.geneLabels.tooltipContent);
    element.call(d3.SpotMyGene.geneTip);
    d3.SpotMyGene.dispatch.on('geneMouseover', function(d, i, j) {
      return d3.SpotMyGene.geneTip.attr('class', 'd3-tip appear').show(geneByIds[d]);
    });
    return d3.SpotMyGene.dispatch.on('geneMouseout', function(d, i, j) {
      d3.SpotMyGene.geneTip.attr('class', 'd3-tip').show(geneByIds[d]);
      return d3.SpotMyGene.geneTip.hide();
    });
  }
};

d3.SpotMyGene.listenSampleMouseover = function(element, params, data) {
  var l, len, ref, sample, sampleByIds;
  if (params.sampleLabels.showTooltips) {
    sampleByIds = {};
    ref = data.samples;
    for (l = 0, len = ref.length; l < len; l++) {
      sample = ref[l];
      sampleByIds[sample.id] = sample;
    }
    d3.SpotMyGene.sampleTip = d3.tip().direction('s').offset([20, 0]).html(params.sampleLabels.tooltipContent);
    element.call(d3.SpotMyGene.sampleTip);
    d3.SpotMyGene.dispatch.on('sampleMouseover', function(d, i, j) {
      return d3.SpotMyGene.sampleTip.attr('class', 'd3-tip appear').show(sampleByIds[d]);
    });
    return d3.SpotMyGene.dispatch.on('sampleMouseout', function(d, i, j) {
      d3.SpotMyGene.sampleTip.attr('class', 'd3-tip').show(sampleByIds[d]);
      return d3.SpotMyGene.sampleTip.hide();
    });
  }
};

d3.SpotMyGene.dispatch.on('cellMouseover', function(cell, d, i, j) {
  return d3.select(cell).classed('active', true);
});

d3.SpotMyGene.dispatch.on('cellMouseout', function(cell, d, i, j) {
  return d3.select(cell).classed('active', false);
});

d3.SpotMyGene.buildColorScale = function(cells) {
  var colors;
  colors = ['#005824', '#1A693B', '#347B53', '#4F8D6B', '#699F83', '#83B09B', '#9EC2B3', '#B8D4CB', '#D2E6E3', '#EDF8FB', '#FFFFFF', '#F1EEF6', '#E6D3E1', '#DBB9CD', '#D19EB9', '#C684A4', '#BB6990', '#B14F7C', '#A63467', '#9B1A53', '#91003F'];
  return d3.scale.quantile().domain(d3.extent(cells, function(cell) {
    return cell.value;
  })).range(colors);
};

d3.SpotMyGene.renderSampleLabels = function(parentElement, scale, params, data) {};

d3.SpotMyGene.renderGeneLabels = function(parentElement, scale, params, data) {};

d3.SpotMyGene.euclideanDistance = function(data, rowLabels, colLabels, type) {
  var buildMatrix, distances, i, j, k, l, m, matrix, n, o, p, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, val;
  distances = [];
  matrix = buildMatrix = function(data) {
    var cell, gene, genesIdx, idx, l, len, ref, ref1, ref2, results, row, sample, samplesIdx;
    samplesIdx = {};
    genesIdx = {};
    ref = data.samples;
    for (idx in ref) {
      sample = ref[idx];
      samplesIdx[sample.id] = idx;
    }
    ref1 = data.genes;
    for (idx in ref1) {
      gene = ref1[idx];
      genesIdx[gene.id] = idx;
    }
    matrix = (function() {
      var l, len, ref2, results;
      ref2 = data.genes;
      results = [];
      for (l = 0, len = ref2.length; l < len; l++) {
        row = ref2[l];
        results.push([0]);
      }
      return results;
    })();
    ref2 = data.cells;
    results = [];
    for (l = 0, len = ref2.length; l < len; l++) {
      cell = ref2[l];
      results.push(matrix[genesIdx[cell.geneId]][samplesIdx[cell.sampleId]] = cell.value);
    }
    return results;
  };
  buildMatrix(data);
  if (type === "col") {
    for (i = l = 0, ref = colLabels.length - 2; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
      for (j = m = ref1 = i + 1, ref2 = colLabels.length - 1; ref1 <= ref2 ? m <= ref2 : m >= ref2; j = ref1 <= ref2 ? ++m : --m) {
        val = 0;
        for (k = n = 0, ref3 = rowLabels.length - 1; 0 <= ref3 ? n <= ref3 : n >= ref3; k = 0 <= ref3 ? ++n : --n) {
          val += Math.pow(matrix[k][i] - matrix[k][j], 2);
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
          val += Math.pow(matrix[i][k] - matrix[j][k], 2);
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
      value: distance.value,
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

d3.SpotMyGene.getRange = function(elements, root) {
  var element, elementIdx, leaf, leafIdx, leaves, range;
  leaves = d3.SpotMyGene.leaves(root);
  range = [];
  for (elementIdx in elements) {
    element = elements[elementIdx];
    for (leafIdx in leaves) {
      leaf = leaves[leafIdx];
      if (leaf.name === element.name) {
        range.push(parseInt(leafIdx));
        break;
      }
    }
  }
  return range;
};

d3.SpotMyGene.Core.prototype.render = function(svg, data, params) {
  var cells, colorScale, filterBySample, gene, geneIds, geneLabels, geneRoot, geneScale, genesOrder, idx, legend, sample, sampleIds, sampleLabels, sampleRoot, sampleScale, samplesOrder;
  if (!data) {
    return;
  }
  geneIds = (function() {
    var l, len, ref, results;
    ref = data.genes;
    results = [];
    for (l = 0, len = ref.length; l < len; l++) {
      gene = ref[l];
      results.push(gene.id);
    }
    return results;
  })();
  sampleIds = (function() {
    var l, len, ref, results;
    ref = data.samples;
    results = [];
    for (l = 0, len = ref.length; l < len; l++) {
      sample = ref[l];
      results.push(sample.id);
    }
    return results;
  })();
  sampleRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "col"), sampleIds);
  samplesOrder = d3.SpotMyGene.getRange(data.samples, sampleRoot);
  geneRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "row"), geneIds);
  genesOrder = d3.SpotMyGene.getRange(data.genes, geneRoot);
  filterBySample = function(cells, samples) {
    var selectedIds;
    selectedIds = samples.map(function(sample) {
      return sample.name;
    });
    return data.cells.filter(function(cell) {
      var ref;
      return ref = cell.sampleId, indexOf.call(selectedIds, ref) >= 0;
    });
  };
  sampleScale = d3.scale.ordinal().domain(sampleIds).range((function() {
    var l, len, results;
    results = [];
    for (l = 0, len = samplesOrder.length; l < len; l++) {
      idx = samplesOrder[l];
      results.push(idx * params.heatmap.cell.width);
    }
    return results;
  })());
  geneScale = d3.scale.ordinal().domain(geneIds).range((function() {
    var l, len, results;
    results = [];
    for (l = 0, len = genesOrder.length; l < len; l++) {
      idx = genesOrder[l];
      results.push(idx * params.heatmap.cell.height);
    }
    return results;
  })());
  sampleLabels = svg.select('.sample-labels').append('g').attr('class', 'x axis');
  geneLabels = svg.select('.gene-labels').append('g').attr('class', 'y axis').attr("transform", "translate(0, " + (params.heatmap.cell.height / 2) + ")");
  cells = svg.select('.heatmap').append('g').attr('class', 'cells-group');
  colorScale = d3.SpotMyGene.buildColorScale(data.cells);
  legend = new d3.SpotMyGene.HeatmapLegend(params.legend);
  legend.render(colorScale);
  d3.SpotMyGene.dispatch.on('updateSelectedSamples', function(root, samples) {
    var cellsData;
    samplesOrder = d3.SpotMyGene.getRange(samples, root);
    params.heatmap.cell.width = params.heatmap.width / samples.length;
    sampleScale = d3.scale.ordinal().domain((function() {
      var l, len, results;
      results = [];
      for (l = 0, len = samples.length; l < len; l++) {
        sample = samples[l];
        results.push(sample.name);
      }
      return results;
    })()).range((function() {
      var l, len, results;
      results = [];
      for (l = 0, len = samplesOrder.length; l < len; l++) {
        idx = samplesOrder[l];
        results.push(idx * params.heatmap.cell.width);
      }
      return results;
    })());
    d3.SpotMyGene.renderHeatmapAxes(geneLabels, sampleLabels, geneScale, sampleScale, params);
    cellsData = filterBySample(data.cells, samples);
    return d3.SpotMyGene.renderHeatmapCells(svg, cells, cellsData, params, sampleScale, geneScale);
  });
  d3.SpotMyGene.renderDendogram(svg, sampleRoot, params);
  d3.SpotMyGene.renderHeatmapAxes(geneLabels, sampleLabels, geneScale, sampleScale, params);
  d3.SpotMyGene.renderHeatmapCells(svg, cells, data.cells, params, sampleScale, geneScale);
  return d3.SpotMyGene.dispatch.renderEnd();
};

d3.SpotMyGene.Core.prototype.render2 = function(data, params) {
  var heatmap, svg;
  svg = d3.select(params.container).append('svg').style('width', params.width).style('height', params.heatmap.cell.height * data.genes.length + params.sampleLabels.length + params.sampleDendogram.height + params.margins.top);
  svg.selectAll('*').remove();
  svg.append('g').attr('class', 'sample-dendogram').attr('transform', "translate(" + (params.margins.left + params.geneLabels.length + params.geneDendogram.height) + ", 0)");
  svg.append('g').attr('class', 'gene-dendogram');
  heatmap = svg.append('g').attr('class', 'heatmap-with-labels').attr('transform', "translate(" + (params.margins.left + params.geneDendogram.height) + ", " + (params.margins.top + params.sampleDendogram.height) + ")");
  heatmap.append('clipPath').attr('id', 'sample-labels-panel').append('rect').attr('x', 0).attr('y', 0).attr('width', params.heatmap.width).attr('height', params.sampleLabels.length);
  heatmap.append('g').attr('class', 'sample-labels').attr('transform', "translate(" + params.geneLabels.length + ", 0)").attr('clip-path', 'url(#sample-labels-panel)');
  heatmap.append('clipPath').attr('id', 'gene-labels-panel').append('rect').attr('x', 0).attr('y', 0).attr('width', params.geneLabels.length).attr('height', params.heatmap.height);
  heatmap.append('g').attr('class', 'gene-labels').attr('transform', "translate(0, " + params.sampleLabels.length + ")").attr('clip-path', 'url(#gene-labels-panel)');
  heatmap.append('clipPath').attr('id', 'heatmap-panel').append('rect').attr('x', 0).attr('y', 0).attr('width', params.heatmap.width).attr('height', params.heatmap.height);
  heatmap.append('g').attr('class', 'heatmap').attr('transform', "translate(" + params.geneLabels.length + ", " + params.sampleLabels.length + ")").attr('clip-path', 'url(#heatmap-panel)');
  return this.render(svg, data, params);
};

d3.SpotMyGene.renderDendogram = function(svg, tree, params) {
  var cluster, height, leaves, line, lineData, link, links, nodes, width;
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
    return node.children == null;
  });
  d3.SpotMyGene.resizeTree(width, height, leaves.length, nodes[0]);
  svg.select('.sample-dendogram').selectAll('.link').remove();
  link = svg.select('.sample-dendogram').selectAll('.link').data(links);
  return link.enter().append('path').attr('class', 'link').attr('d', lineData).on('click', function(d) {
    var selectedSamples;
    selectedSamples = d3.SpotMyGene.leaves(d.source);
    d3.SpotMyGene.addSubTreeClass(d, nodes, link, 'active');
    return d3.SpotMyGene.dispatch.updateSelectedSamples(d.source, selectedSamples);
  }).on('mouseover', function(d) {
    return d3.SpotMyGene.addSubTreeClass(d, nodes, link, 'highlight');
  }).on('mouseout', function(d) {
    return d3.SpotMyGene.removeSubTreeClass(nodes, link, 'highlight');
  });
};

d3.SpotMyGene.resizeTree = function(width, height, leavesNumber, root) {
  var cellWidth, computeY, index, setNodeSize;
  cellWidth = width / leavesNumber;
  index = 0;
  computeY = function(value) {
    return height * (1 - value / root.value);
  };
  setNodeSize = function(node) {
    var child, l, len, ref;
    if (node.children == null) {
      node.x = cellWidth * index + cellWidth / 2;
      index++;
    } else {
      ref = node.children;
      for (l = 0, len = ref.length; l < len; l++) {
        child = ref[l];
        setNodeSize(child);
      }
      if (node.children.length === 1) {
        node.x = node.children[0].x;
      } else {
        node.x = (node.children[0].x + node.children[1].x) / 2;
      }
    }
    if (node.value != null) {
      return node.y = computeY(node.value);
    } else {
      return node.y = height;
    }
  };
  return setNodeSize(root);
};

d3.SpotMyGene.addSubTreeClass = function(d, nodes, link, className) {
  var classChildNodes, l, len, node;
  for (l = 0, len = nodes.length; l < len; l++) {
    node = nodes[l];
    node[className] = false;
  }
  classChildNodes = function(node) {
    node[className] = true;
    if (node.children != null) {
      classChildNodes(node.children[0]);
      return classChildNodes(node.children[1]);
    }
  };
  classChildNodes(d.source);
  return link.classed(className, function(d) {
    return d.target[className];
  });
};

d3.SpotMyGene.removeSubTreeClass = function(nodes, link, className) {
  var l, len, node;
  for (l = 0, len = nodes.length; l < len; l++) {
    node = nodes[l];
    node[className] = false;
  }
  return link.classed(className, false);
};

d3.SpotMyGene.varianceScaling = function(cells) {
  var cell, deviation, geneCells, l, len, mean, nest, results;
  nest = d3.nest().key(function(cell) {
    return cell.geneId;
  }).entries(cells);
  results = [];
  for (l = 0, len = nest.length; l < len; l++) {
    geneCells = nest[l];
    mean = d3.mean(geneCells.values, function(cell) {
      return cell.value;
    });
    deviation = d3.deviation(geneCells.values, function(cell) {
      return cell.value;
    });
    results.push((function() {
      var len1, m, ref, results1;
      ref = geneCells.values;
      results1 = [];
      for (m = 0, len1 = ref.length; m < len1; m++) {
        cell = ref[m];
        results1.push(cell.value = (cell.value - mean) / deviation);
      }
      return results1;
    })());
  }
  return results;
};

d3.SpotMyGene.zoom = function(params, behavior) {
  var moveChecker;
  moveChecker = function(translateX, translateY, scale, width, height) {
    var maxX, maxY;
    maxX = (scale - 1) * width;
    maxY = (scale - 1) * height;
    if (translateX > 0) {
      translateX = 0;
    }
    if (translateY > 0) {
      translateY = 0;
    }
    if (translateX < -maxX) {
      translateX = -maxX;
    }
    if (translateY < -maxY) {
      translateY = -maxY;
    }
    behavior.translate([translateX, translateY]);
    return [translateX, translateY];
  };
  return function() {
    var ref, scale, translateX, translateY;
    scale = d3.event.scale;
    ref = moveChecker(d3.event.translate[0], d3.event.translate[1], d3.event.scale, params.heatmap.width, params.heatmap.height), translateX = ref[0], translateY = ref[1];
    d3.select('.cells-group').attr('transform', "translate(" + translateX + ", " + translateY + ") scale(" + scale + ", " + scale + ")");
    d3.select('.x.axis').attr('transform', "translate(" + (translateX + params.heatmap.cell.height * scale / 2) + ", 0) scale(" + scale + ")");
    return d3.select('.y.axis').attr('transform', "translate(0, " + (translateY + params.heatmap.cell.height * scale / 2) + ") scale(" + scale + ")");
  };
};

d3.SpotMyGene.renderHeatmapAxes = function(geneLabels, sampleLabels, geneScale, sampleScale, params) {
  var geneAxis, sampleAxis;
  geneAxis = d3.svg.axis().orient('right');
  geneAxis.scale(geneScale);
  geneLabels.call(geneAxis);
  sampleAxis = d3.svg.axis().orient('bottom');
  sampleAxis.scale(sampleScale);
  return sampleLabels.call(sampleAxis).selectAll('text').attr('transform', "translate(" + (params.heatmap.cell.width / 2) + ", 0) rotate(-45)").style("text-anchor", "end");
};

d3.SpotMyGene.renderHeatmapCells = function(parentContainer, cells, cellsData, params, sampleScale, geneScale) {
  var colorScale;
  colorScale = d3.SpotMyGene.buildColorScale(cellsData);
  cells = cells.selectAll('rect').data(cellsData, function(d) {
    return d.sampleId + "-" + d.geneId;
  });
  cells.transition().style('fill', function(d) {
    return colorScale(d.value);
  }).attr('x', function(d) {
    return sampleScale(d.sampleId);
  }).attr('y', function(d) {
    return geneScale(d.geneId);
  }).attr('width', params.heatmap.cell.width).attr('height', params.heatmap.cell.height);
  cells.enter().append('rect').attr('class', 'cell').style('fill', 'white').on('mouseover', function(d) {
    return d3.SpotMyGene.dispatch.cellMouseover(this, d);
  }).on('mouseout', function(d) {
    return d3.SpotMyGene.dispatch.cellMouseout(this, d);
  }).transition().attr('x', function(d) {
    return sampleScale(d.sampleId);
  }).attr('y', function(d) {
    return geneScale(d.geneId);
  }).attr('width', params.heatmap.cell.width).attr('height', params.heatmap.cell.height).style('fill', function(d) {
    return colorScale(d.value);
  });
  return cells.exit().remove();
};

d3.SpotMyGene.HeatmapLegend = function(params) {
  var labelsHeight, legend, svg;
  labelsHeight = params.labels.size;
  svg = d3.select(params.container).append('svg').style('width', params.width).style('height', params.height + labelsHeight);
  legend = svg.append('g').attr('class', 'legend-tills');
  this.render = function(colorScale) {
    var quantiles, selection, tillWidth;
    quantiles = colorScale.quantiles();
    selection = legend.selectAll('rect').data(quantiles);
    tillWidth = params.width / colorScale.range().length;
    selection.enter().append('rect').style('fill', function(d) {
      return colorScale(d);
    }).attr('x', function(d, i) {
      return tillWidth * i;
    }).attr('y', 0).attr('width', tillWidth).attr('height', params.height);
    if (params.labels != null) {
      return selection.enter().append('text').attr('class', 'mono').text(function(d) {
        return "≥ " + (d.toPrecision(params.labels.precision));
      }).attr('x', function(d, i) {
        return tillWidth * i;
      }).attr('y', params.height + labelsHeight).style('font-size', params.labels.size).style('fill', params.labels.color);
    }
  };
  return this;
};
