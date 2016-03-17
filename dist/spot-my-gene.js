var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

d3.selectable = function(ul, li, update) {
  var isParentNode, keyCodes, lastDecision, select, selectFirst, selectLast;
  lastDecision = void 0;
  isParentNode = function(parentNode, node) {
    if (!node) {
      return false;
    }
    if (node === parentNode) {
      return true;
    }
    return isParentNode(parentNode, node.parentNode);
  };
  selectFirst = function(selection) {
    return selection.each(function(d, i) {
      if (i === 0) {
        return d._selected = true;
      }
    });
  };
  selectLast = function(selection) {
    return selection.each(function(d, i, j) {
      if (i === selection[j].length - 1) {
        return d._selected = true;
      }
    });
  };
  select = function(d, node) {
    var currentIndex, firstSelectedIndex, lastSelectedIndex, lis, max, min, parentNode;
    parentNode = ul.filter(function() {
      return isParentNode(this, node);
    }).node();
    lis = li.filter(function() {
      return isParentNode(parentNode, this);
    });
    if (d3.event.shiftKey) {
      firstSelectedIndex = void 0;
      lastSelectedIndex = void 0;
      currentIndex = void 0;
      lis.each(function(dl, i) {
        if (dl._selected) {
          firstSelectedIndex || (firstSelectedIndex = i);
          lastSelectedIndex = i;
        }
        if (this === node) {
          currentIndex = i;
        }
      });
      min = Math.min(firstSelectedIndex, lastSelectedIndex, currentIndex);
      max = Math.max(firstSelectedIndex, lastSelectedIndex, currentIndex);
      lis.each(function(d, i) {
        d._selected = d3.event.ctrlKey && d._selected || i >= min && i <= max;
      });
    } else {
      if (!d3.event.ctrlKey) {
        lis.each(function(d) {
          d._selected = false;
        });
      }
      d._selected = !d._selected;
    }
    lastDecision = d._selected;
    update();
  };
  li.on('mousedown.selectable', function(d) {
    select(d, this);
  });
  li.on('mouseover.selectable', function(d) {
    if (d3.event.which) {
      d._selected = lastDecision;
      update();
    }
  });
  keyCodes = {
    up: 38,
    down: 40,
    home: 36,
    end: 35,
    a: 65
  };
  ul.on('keydown.selectable', function() {
    var focus, madeSelection, scope, selecteds;
    if (d3.values(keyCodes).indexOf(d3.event.keyCode) === -1) {
      return;
    }
    if (d3.event.keyCode === keyCodes.a && !d3.event.ctrlKey) {
      return;
    }
    focus = ul.filter(':focus').node();
    if (!focus) {
      return;
    }
    d3.event.preventDefault();
    scope = li.filter(function(d) {
      return isParentNode(focus, this);
    });
    selecteds = scope.select(function(d) {
      return d._selected;
    });
    if (!d3.event.ctrlKey) {
      scope.each(function(d) {
        d._selected = false;
      });
    }
    madeSelection = false;
    switch (d3.event.keyCode) {
      case keyCodes.up:
        selecteds.each(function(d, i, j) {
          if (scope[j][i - 1]) {
            madeSelection = d3.select(scope[j][i - 1]).data()[0]._selected = true;
          }
        });
        if (!madeSelection) {
          selectLast(scope);
        }
        break;
      case keyCodes.down:
        selecteds.each(function(d, i, j) {
          if (scope[j][i + 1]) {
            madeSelection = d3.select(scope[j][i + 1]).data()[0]._selected = true;
          }
        });
        if (!madeSelection) {
          selectFirst(scope);
        }
        break;
      case keyCodes.home:
        selectFirst(scope);
        break;
      case keyCodes.end:
        selectLast(scope);
        break;
      case keyCodes.a:
        scope.each(function(d) {
          d._selected = !d3.event.shiftKey;
        });
    }
    update();
  });
};

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

d3.SpotMyGene.dispatch = d3.dispatch('geneMouseover', 'sampleMouseover', 'geneMouseout', 'sampleMouseout', 'cellMouseover', 'cellMouseout', 'cellMouseout', 'renderEnd', 'updateSelectedSamples', 'updateSelectedGenes');

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

d3.SpotMyGene.SampleLabels = function(params, parentElement) {
  var render, sampleLabels, updateSelected;
  sampleLabels = parentElement.select('.sample-labels').append('g').attr('class', 'x axis');
  updateSelected = function() {
    var selectedSamples;
    sampleLabels.selectAll('text').classed('selected', function(d) {
      return d._selected;
    });
    selectedSamples = sampleLabels.selectAll('text').data().filter(function(sample) {
      return sample._selected;
    });
    return d3.SpotMyGene.dispatch.updateSelectedSamples(selectedSamples);
  };
  render = function(samples) {
    var selection;
    selection = sampleLabels.selectAll('text').data(samples, function(sample) {
      return sample.id;
    });
    selection.text(function(d) {
      return d.id;
    }).attr('x', function(d, i) {
      return i * params.heatmap.cell.width;
    });
    selection.enter().append('text').text(function(d) {
      return d.id;
    }).attr('text-anchor', 'middle').attr('transform', function(d, i) {
      return "translate(" + (params.heatmap.cell.width * i + params.heatmap.cell.width / 2) + ", " + (params.sampleLabels.length / 2) + ") rotate(-45)";
    }).on('mouseover.label', d3.SpotMyGene.dispatch.sampleMouseover).on('mouseout.label', d3.SpotMyGene.dispatch.sampleMouseout);
    selection.exit().remove();
    d3.selectable(sampleLabels, sampleLabels.selectAll('text'), updateSelected);
    return d3.SpotMyGene.listenSampleMouseover(sampleLabels, params);
  };
  this.render = render;
  return this;
};

d3.SpotMyGene.GeneLabels = function(params, parentElement) {
  var geneLabels, render, updateSelected;
  geneLabels = parentElement.select('.gene-labels').append('g').attr('class', 'y axis').attr('transform', "translate(0, " + (params.heatmap.cell.height / 2) + ")");
  updateSelected = function() {
    var selectedGenes;
    geneLabels.selectAll('text').classed('selected', function(d) {
      return d._selected;
    });
    selectedGenes = geneLabels.selectAll('text').data().filter(function(gene) {
      return gene._selected;
    });
    return d3.SpotMyGene.dispatch.updateSelectedGenes(selectedGenes);
  };
  render = function(genes) {
    var selection;
    selection = geneLabels.selectAll('text').data(genes, function(gene) {
      return gene.id;
    });
    selection.text(function(d) {
      return d.id;
    }).attr('y', function(d, i) {
      return i * params.heatmap.cell.height;
    });
    selection.enter().append('text').text(function(d) {
      return d.id;
    }).attr('x', 0).attr('y', function(d, i) {
      return i * params.heatmap.cell.height;
    });
    selection.exit().remove();
    return d3.selectable(geneLabels, geneLabels.selectAll('text'), updateSelected);
  };
  this.render = render;
  return this;
};

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

d3.SpotMyGene.sortByCluster = function(elements, root) {
  var element, elementIdx, leaf, leafIdx, leaves;
  leaves = d3.SpotMyGene.leaves(root);
  for (elementIdx in elements) {
    element = elements[elementIdx];
    for (leafIdx in leaves) {
      leaf = leaves[leafIdx];
      if (leaf.name === element.name) {
        elements.idx = leafIdx;
        break;
      }
    }
  }
  return elements.sort(function(a, b) {
    return d3.ascending(a.idx, b.idx);
  });
};

d3.SpotMyGene.Core.prototype.render = function(svg, data, params) {
  var cells, colorScale, filterBySample, gene, geneIds, geneLabels, genePie, geneRoot, geneScale, i, legend, sample, sampleIds, sampleLabels, samplePie, sampleRoot, sampleScale;
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
  d3.SpotMyGene.sortByCluster(data.samples, sampleRoot);
  geneRoot = d3.SpotMyGene.clusteringUPGMA(d3.SpotMyGene.euclideanDistance(data, geneIds, sampleIds, "row"), geneIds);
  d3.SpotMyGene.sortByCluster(data.genes, geneRoot);
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
  sampleScale = d3.scale.ordinal().domain((function() {
    var l, len, ref, results;
    ref = data.samples;
    results = [];
    for (l = 0, len = ref.length; l < len; l++) {
      sample = ref[l];
      results.push(sample.id);
    }
    return results;
  })()).range((function() {
    var results;
    results = [];
    for (i in data.samples) {
      results.push(i * params.heatmap.cell.width);
    }
    return results;
  })());
  geneScale = d3.scale.ordinal().domain((function() {
    var l, len, ref, results;
    ref = data.genes;
    results = [];
    for (l = 0, len = ref.length; l < len; l++) {
      gene = ref[l];
      results.push(gene.id);
    }
    return results;
  })()).range((function() {
    var results;
    results = [];
    for (i in data.genes) {
      results.push(i * params.heatmap.cell.height);
    }
    return results;
  })());
  cells = svg.select('.heatmap').append('g').attr('class', 'cells-group');
  colorScale = d3.SpotMyGene.buildColorScale(data.cells);
  legend = new d3.SpotMyGene.HeatmapLegend(params.legend);
  legend.render(colorScale);
  d3.SpotMyGene.renderDendogram(svg, sampleRoot, data.samples, params);
  d3.SpotMyGene.renderHeatmapCells(svg, cells, data.cells, params, sampleScale, geneScale);
  geneLabels = new d3.SpotMyGene.GeneLabels(params, svg);
  geneLabels.render(data.genes);
  sampleLabels = new d3.SpotMyGene.SampleLabels(params, svg);
  sampleLabels.render(data.samples);
  samplePie = new d3.SpotMyGene.SamplePie(params.samplePie, data.samples);
  samplePie.render(data.samples, function(sample) {
    return sample.summary.sx;
  });
  genePie = new d3.SpotMyGene.GenePie(params.genePie, data.genes);
  genePie.render(data.genes, function(gene) {
    if (gene.id[gene.id.length - 1] === "1") {
      return 'Protein coding';
    }
    if (gene.id[gene.id.length - 1] === "2") {
      return 'Hormone';
    }
    if (gene.id[gene.id.length - 1] === "3") {
      return 'Marker';
    }
    if (gene.id[gene.id.length - 1] === "4") {
      return 'SiRNA';
    }
    if (gene.id[gene.id.length - 1] === "5") {
      return 'Cell cycle';
    }
    if (gene.id[gene.id.length - 1] === "6") {
      return 'Transcription factor';
    }
    if (gene.id[gene.id.length - 1] === "7") {
      return 'Antigen';
    }
    if (gene.id[gene.id.length - 1] === "8") {
      return 'Adhesion molecule';
    }
    if (gene.id[gene.id.length - 1] === "9") {
      return 'Ribozyme';
    }
    if (gene.id[gene.id.length - 1] === "0") {
      return 'Growth factor';
    }
    return "Unknown";
  });
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

d3.SpotMyGene.renderDendogram = function(svg, tree, samples, params) {
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
    var leaf, names, selectedLeaves, selectedSamples;
    selectedLeaves = d3.SpotMyGene.leaves(d.source);
    d3.SpotMyGene.addSubTreeClass(d, nodes, link, 'active');
    names = (function() {
      var l, len, results;
      results = [];
      for (l = 0, len = selectedLeaves.length; l < len; l++) {
        leaf = selectedLeaves[l];
        results.push(leaf.name);
      }
      return results;
    })();
    selectedSamples = samples.filter(function(sample) {
      var ref;
      return ref = sample.id, indexOf.call(names, ref) >= 0;
    });
    return d3.SpotMyGene.dispatch.updateSelectedSamples(selectedSamples);
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

d3.SpotMyGene.SamplePie = function(params, initialSamples) {
  var chart, currentIds, render;
  currentIds = [];
  chart = c3.generate({
    bindto: params.container,
    data: {
      columns: [],
      type: 'pie'
    }
  });
  render = function(samples, accessor) {
    var elt, idsToUnload, nest, newIds;
    nest = d3.nest().key(accessor).sortKeys(d3.ascending).entries(samples);
    newIds = (function() {
      var l, len, results;
      results = [];
      for (l = 0, len = nest.length; l < len; l++) {
        elt = nest[l];
        results.push(elt.key);
      }
      return results;
    })();
    idsToUnload = currentIds.filter(function(id) {
      return indexOf.call(newIds, id) < 0;
    });
    chart.load({
      columns: (function() {
        var l, len, results;
        results = [];
        for (l = 0, len = nest.length; l < len; l++) {
          elt = nest[l];
          results.push([elt.key, elt.values.length]);
        }
        return results;
      })()
    });
    chart.unload({
      ids: idsToUnload
    });
    return currentIds = newIds;
  };
  d3.SpotMyGene.dispatch.on('updateSelectedSamples.samplePie', function(selectedSamples) {
    return render(selectedSamples, function(sample) {
      return sample.summary.sx;
    });
  });
  this.render = render;
  return this;
};

d3.SpotMyGene.GenePie = function(params, initialGenes) {
  var chart, currentIds, render;
  currentIds = [];
  chart = c3.generate({
    bindto: params.container,
    data: {
      columns: [],
      type: 'pie'
    }
  });
  render = function(genes, accessor) {
    var elt, idsToUnload, nest, newIds;
    nest = d3.nest().key(accessor).sortKeys(d3.ascending).entries(genes);
    newIds = (function() {
      var l, len, results;
      results = [];
      for (l = 0, len = nest.length; l < len; l++) {
        elt = nest[l];
        results.push(elt.key);
      }
      return results;
    })();
    idsToUnload = currentIds.filter(function(id) {
      return indexOf.call(newIds, id) < 0;
    });
    chart.load({
      columns: (function() {
        var l, len, results;
        results = [];
        for (l = 0, len = nest.length; l < len; l++) {
          elt = nest[l];
          results.push([elt.key, elt.values.length]);
        }
        return results;
      })()
    });
    chart.unload({
      ids: idsToUnload
    });
    return currentIds = newIds;
  };
  d3.SpotMyGene.dispatch.on('updateSelectedGenes.pie', function(selectedGenes) {
    return render(selectedGenes, function(gene, i) {
      if (gene.id[gene.id.length - 1] === "1") {
        return 'Protein coding';
      }
      if (gene.id[gene.id.length - 1] === "2") {
        return 'Hormone';
      }
      if (gene.id[gene.id.length - 1] === "3") {
        return 'Marker';
      }
      if (gene.id[gene.id.length - 1] === "4") {
        return 'SiRNA';
      }
      if (gene.id[gene.id.length - 1] === "5") {
        return 'Cell cycle';
      }
      if (gene.id[gene.id.length - 1] === "6") {
        return 'Transcription factor';
      }
      if (gene.id[gene.id.length - 1] === "7") {
        return 'Antigen';
      }
      if (gene.id[gene.id.length - 1] === "8") {
        return 'Adhesion molecule';
      }
      if (gene.id[gene.id.length - 1] === "9") {
        return 'Ribozyme';
      }
      if (gene.id[gene.id.length - 1] === "0") {
        return 'Growth factor';
      }
      return "Unknown";
    });
  });
  this.render = render;
  return this;
};
