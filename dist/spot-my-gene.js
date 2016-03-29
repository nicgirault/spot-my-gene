var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

d3.SpotMyGene = function(data, params) {
  var instance;
  params = d3.SpotMyGene.Parameters(params);
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
  params.geneDendogram.width = params.heatmap.height;
  return d3.SpotMyGene.varianceScaling(data.cells);
};

d3.SpotMyGene.selectedSamples = [];

d3.SpotMyGene.dispatch = d3.dispatch('geneMouseover', 'sampleMouseover', 'geneMouseout', 'sampleMouseout', 'cellMouseover', 'cellMouseout', 'cellMouseout', 'renderEnd', 'updateSelectedSamples', 'updateSelectedGenes', 'genePieAccessorChanged');

d3.SpotMyGene.Parameters = function(parameters) {
  var defaults;
  defaults = {
    container: '#chart',
    width: 800,
    maxHeight: 2000,
    margins: {
      left: 10,
      top: 10
    },
    sampleLabels: {
      length: 65,
      showTooltips: true,
      tooltipContent: function(d) {
        var html, key, ref, value;
        html = '<table class="c3-tooltip">';
        ref = d.summary;
        for (key in ref) {
          value = ref[key];
          html += '<tr><td>' + key + '</td><td> ' + value + '</td></tr>';
        }
        html += '</table>';
        return html;
      }
    },
    geneLabels: {
      margin: 5,
      length: 100,
      showTooltips: true,
      tooltipContent: function(d) {
        var html, key, ref, value;
        html = '<ul>';
        ref = d.metadata;
        for (key in ref) {
          value = ref[key];
          html += '<li><b>' + key + '</b>: ' + value + '</li>';
        }
        html += '</ul>';
        return html;
      }
    },
    sampleDendogram: {
      height: 200
    },
    geneDendogram: {
      height: 200
    },
    heatmap: {
      cell: {
        height: 30
      },
      colors: ['#E75753', '#FEFEFE', '#009688']
    },
    zoom: {
      enabled: true,
      maxCellHeight: 60,
      maxCellWidth: 80
    },
    legend: {
      container: '#legend',
      width: 700,
      height: 20,
      size: 10,
      labels: {
        size: 9,
        precision: 2,
        color: '#444'
      }
    }
  };
  return d3.SpotMyGene.defaults(parameters, defaults);
};

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

d3.SpotMyGene.sortByCluster = function(elements, root, reverse) {
  var element, elementIdx, leaf, leafIdx, leaves;
  leaves = d3.SpotMyGene.leaves(root);
  if (reverse) {
    leaves.reverse();
  }
  for (elementIdx in elements) {
    element = elements[elementIdx];
    for (leafIdx in leaves) {
      leaf = leaves[leafIdx];
      if (leaf.name === element.name) {
        element.idx = parseInt(leafIdx);
        break;
      }
    }
  }
  return elements.sort(function(a, b) {
    return d3.ascending(a.idx, b.idx);
  });
};

d3.SpotMyGene.Core.prototype.render = function(svg, data, params) {
  var filterBySample, gene, geneDendogram, geneIds, geneLabels, geneRoot, geneScale, heatmap, i, legend, ref, sample, sampleDendogram, sampleIds, sampleLabels, sampleRoot, sampleScale;
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
  d3.SpotMyGene.sortByCluster(data.genes, geneRoot, true);
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
  sampleDendogram = new d3.SpotMyGene.SampleDendogram(svg, params.sampleDendogram);
  sampleDendogram.render(sampleRoot, data.samples);
  geneDendogram = new d3.SpotMyGene.GeneDendogram(svg, params.geneDendogram);
  geneDendogram.render(geneRoot, data.genes);
  heatmap = new d3.SpotMyGene.Heatmap(svg, data.cells, params.heatmap, sampleScale, geneScale);
  legend = new d3.SpotMyGene.HeatmapLegend(params.legend);
  legend.render(heatmap.colorScale);
  geneLabels = new d3.SpotMyGene.GeneLabels(params, svg);
  geneLabels.render(data.genes);
  sampleLabels = new d3.SpotMyGene.SampleLabels(params, svg);
  sampleLabels.render(data.samples);
  if ((ref = params.zoom) != null ? ref.enabled : void 0) {
    d3.SpotMyGene.Zoom(svg, params, heatmap, geneLabels);
  }
  return d3.SpotMyGene.dispatch.renderEnd();
};

d3.SpotMyGene.Core.prototype.render2 = function(data, params) {
  var heatmap, svg;
  svg = d3.select(params.container).append('svg').style('width', params.width).style('height', params.heatmap.cell.height * data.genes.length + params.sampleLabels.length + params.sampleDendogram.height + params.margins.top);
  svg.selectAll('*').remove();
  svg.append('g').attr('class', 'sample-dendogram').attr('transform', "translate(" + (params.margins.left + params.geneLabels.length + params.geneDendogram.height) + ", 0)");
  svg.append('g').attr('class', 'gene-dendogram').attr('transform', "translate(" + params.margins.left + ", " + (params.sampleLabels.length + params.sampleDendogram.height + params.heatmap.height + params.heatmap.cell.height / 2) + ") rotate(-90)");
  heatmap = svg.append('g').attr('class', 'heatmap-with-labels').attr('transform', "translate(" + (params.margins.left + params.geneDendogram.height) + ", " + (params.margins.top + params.sampleDendogram.height) + ")");
  heatmap.append('clipPath').attr('id', 'sample-labels-panel').append('rect').attr('x', 0).attr('y', 0).attr('width', params.heatmap.width).attr('height', params.sampleLabels.length);
  heatmap.append('g').attr('class', 'sample-labels').attr('transform', "translate(" + params.geneLabels.length + ", 0)").attr('clip-path', 'url(#sample-labels-panel)');
  heatmap.append('clipPath').attr('id', 'gene-labels-panel').append('rect').attr('x', 0).attr('y', 0).attr('width', params.geneLabels.length).attr('height', params.heatmap.height);
  heatmap.append('g').attr('class', 'gene-labels').attr('transform', "translate(0, " + params.sampleLabels.length + ")").attr('clip-path', 'url(#gene-labels-panel)');
  heatmap.append('clipPath').attr('id', 'heatmap-panel').append('rect').attr('x', 0).attr('y', 0).attr('width', params.heatmap.width).attr('height', params.heatmap.height);
  heatmap.append('g').attr('class', 'heatmap').attr('transform', "translate(" + (params.geneLabels.length + params.geneLabels.margin) + ", " + params.sampleLabels.length + ")").attr('clip-path', 'url(#heatmap-panel)');
  return this.render(svg, data, params);
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

d3.SpotMyGene.Zoom = (function() {
  function Zoom(svg, params, heatmap, geneLabels) {
    var cells, geneZoom, zoom;
    zoom = d3.behavior.zoom().scaleExtent([1, 8]).center([params.heatmap.width / 2, params.heatmap.height / 2]).size([params.heatmap.width, params.heatmap.height]);
    geneZoom = d3.behavior.zoom().scaleExtent([1, 8]).center([0, params.heatmap.height / 2]).size([params.heatmap.width, params.heatmap.height]);
    d3.selectAll('button[data-zoom-gene]').on('click', d3.SpotMyGene.geneZoom(svg, params, heatmap, geneLabels, geneZoom));
    cells = svg.select('.cells-group');
    geneZoom.on('zoom', d3.SpotMyGene.zoom(svg, params, heatmap, geneLabels, geneZoom));
    geneZoom(svg);
    cells.on("wheel.zoom", null);
    cells.on("mousewheel.zoom", null);
    cells.on("MozMousePixelScroll.zoom", null);
  }

  return Zoom;

})();

d3.SpotMyGene._moveChecker = function(translateX, translateY, scale, params) {
  var maxX, maxY;
  console.log(scale, translateX, translateY);
  if (scale < 1) {
    scale = 1;
  }
  scale = Math.min(scale, params.zoom.maxCellHeight / params.heatmap.cell.height);
  maxX = (scale - 1) * params.heatmap.width;
  maxY = (scale - 1) * params.heatmap.height;
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
  return [[translateX, translateY], scale];
};

d3.SpotMyGene.geneZoom = function(svg, params, heatmap, geneLabels, zoom) {
  return function() {
    var center0, center1, coordinates, coordinates0, point, ref, scale, translate, translate0, translateY;
    point = function(coordinates) {
      var scale, translate;
      scale = zoom.scale();
      translate = zoom.translate();
      return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
    };
    coordinates = function(point) {
      var scale, translate;
      scale = zoom.scale();
      translate = zoom.translate();
      return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
    };
    center0 = zoom.center();
    translate0 = zoom.translate();
    coordinates0 = coordinates(center0);
    scale = zoom.scale() * Math.pow(2, +this.getAttribute('data-zoom-gene'));
    center1 = point(coordinates0);
    translateY = translate0[1] + center0[1] - center1[1];
    ref = d3.SpotMyGene._moveChecker(0, translate0[1] + center0[1] - center1[1], scale, params), translate = ref[0], scale = ref[1];
    zoom.scale(scale);
    zoom.translate(translate);
    geneLabels.zoom(scale, translate);
    return heatmap.zoom([1, scale], translate);
  };
};

d3.SpotMyGene.zoom = function(svg, params, heatmap, geneLabels, behavior) {
  return function() {
    var ref, scale, translate;
    ref = d3.SpotMyGene._moveChecker(d3.event.translate[0], d3.event.translate[1], d3.event.scale, params), translate = ref[0], scale = ref[1];
    svg.select('.x.axis').attr('transform', "translate(" + translate + ") scale(" + scale + ")");
    geneLabels.zoom(scale, translate);
    return heatmap.zoom([scale, scale], translate);
  };
};

d3.SpotMyGene.Heatmap = function(container, cellsData, params, sampleScale, geneScale) {
  var cells, colorScale, domain, heatmap;
  domain = d3.extent(cellsData, function(cell) {
    return cell.value;
  });
  domain.splice(1, 0, (domain[0] + domain[1]) / 2);
  colorScale = d3.scale.linear().domain(domain).range(params.colors);
  heatmap = container.select('.heatmap').append('g').attr('class', 'cells-group');
  cells = heatmap.selectAll('rect').data(cellsData, function(d) {
    return d.sampleId + "-" + d.geneId;
  });
  cells.transition().style('fill', function(d) {
    return colorScale(d.value);
  }).attr('x', function(d) {
    return sampleScale(d.sampleId);
  }).attr('y', function(d) {
    return geneScale(d.geneId);
  }).attr('width', params.cell.width).attr('height', params.cell.height);
  cells.enter().append('rect').attr('class', 'cell').style('fill', 'white').on('mouseover', function(d) {
    return d3.SpotMyGene.dispatch.cellMouseover(this, d);
  }).on('mouseout', function(d) {
    return d3.SpotMyGene.dispatch.cellMouseout(this, d);
  }).transition().attr('x', function(d) {
    return sampleScale(d.sampleId);
  }).attr('y', function(d) {
    return geneScale(d.geneId);
  }).attr('width', params.cell.width).attr('height', params.cell.height).style('fill', function(d) {
    return colorScale(d.value);
  });
  cells.exit().remove();
  this.zoom = function(scale, translate) {
    heatmap.attr('transform', "translate(" + translate + ")");
    return cells.attr('x', function(d) {
      return sampleScale(d.sampleId) * scale[0];
    }).attr('y', function(d) {
      return geneScale(d.geneId) * scale[1];
    }).attr('width', params.cell.width * scale[0]).attr('height', params.cell.height * scale[1]);
  };
  this.colorScale = colorScale;
  return this;
};

d3.SpotMyGene.HeatmapLegend = function(params) {
  var labelsHeight, legend, svg;
  labelsHeight = params.labels.size;
  svg = d3.select(params.container).append('svg').style('width', params.width).style('height', params.height + labelsHeight);
  legend = svg.append('g').attr('class', 'legend-tills');
  this.render = function(colorScale) {
    var domain, i, quantiles, selection, tillWidth;
    domain = colorScale.domain();
    quantiles = (function() {
      var l, ref, results;
      results = [];
      for (i = l = 0, ref = params.size; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        results.push(domain[0] + i * (domain[2] - domain[0]) / (params.size - 1));
      }
      return results;
    })();
    selection = legend.selectAll('rect').data(quantiles);
    tillWidth = params.width / params.size;
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

d3.SpotMyGene.Dendogram = function(svg, params) {
  var cluster, line, lineData;
  cluster = d3.layout.cluster().size([params.width, params.height]);
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
  this._render = function(container, root) {
    var leaves, links, nodes, selection;
    nodes = cluster.nodes(root);
    links = cluster.links(nodes);
    leaves = nodes.filter(function(node) {
      return node.children == null;
    });
    d3.SpotMyGene.resizeTree(params.width, params.height, leaves.length, nodes[0]);
    selection = container.selectAll('.link').data(links);
    selection.exit().remove();
    selection.enter().append('path').attr('class', 'link').attr('d', lineData).on('mouseover', function(d) {
      return d3.SpotMyGene.addSubTreeClass(d, nodes, selection, 'highlight');
    }).on('mouseout', function(d) {
      return d3.SpotMyGene.removeSubTreeClass(nodes, selection, 'highlight');
    });
    return [selection, nodes];
  };
  return this;
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

d3.SpotMyGene.GeneDendogram = function(svg, params) {
  d3.SpotMyGene.Dendogram.call(this, svg, params);
  this.render = (function(_this) {
    return function(root, genes) {
      var container, nodes, ref, selection;
      container = svg.select('.gene-dendogram');
      ref = _this._render(container, root), selection = ref[0], nodes = ref[1];
      selection.on('click', function(d) {
        var leaf, names, selectedGenes, selectedLeaves;
        selectedLeaves = d3.SpotMyGene.leaves(d.source);
        d3.SpotMyGene.addSubTreeClass(d, nodes, selection, 'active');
        names = (function() {
          var l, len, results;
          results = [];
          for (l = 0, len = selectedLeaves.length; l < len; l++) {
            leaf = selectedLeaves[l];
            results.push(leaf.name);
          }
          return results;
        })();
        selectedGenes = genes.filter(function(gene) {
          var ref1;
          return ref1 = gene.id, indexOf.call(names, ref1) >= 0;
        });
        return d3.SpotMyGene.dispatch.updateSelectedGenes(selectedGenes, 'dendogram');
      });
      return d3.SpotMyGene.dispatch.on('updateSelectedGenes.dendogram', function(selectedGenes, source) {
        if (source !== 'dendogram') {
          return d3.SpotMyGene.removeSubTreeClass(root, selection, 'active');
        }
      });
    };
  })(this);
  return this;
};

d3.SpotMyGene.SampleDendogram = function(svg, params) {
  d3.SpotMyGene.Dendogram.call(this, svg, params);
  this.render = (function(_this) {
    return function(root, samples) {
      var container, nodes, ref, selection;
      container = svg.select('.sample-dendogram');
      ref = _this._render(container, root), selection = ref[0], nodes = ref[1];
      selection.on('click', function(d) {
        var leaf, names, selectedLeaves, selectedSamples;
        selectedLeaves = d3.SpotMyGene.leaves(d.source);
        d3.SpotMyGene.addSubTreeClass(d, nodes, selection, 'active');
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
          var ref1;
          return ref1 = sample.id, indexOf.call(names, ref1) >= 0;
        });
        return d3.SpotMyGene.dispatch.updateSelectedSamples(selectedSamples);
      });
      return d3.SpotMyGene.dispatch.on('updateSelectedSamples.dendogram', function(selectedSamples, source) {
        if (source !== 'dendogram') {
          return d3.SpotMyGene.removeSubTreeClass(root, selection, 'active');
        }
      });
    };
  })(this);
  return this;
};

d3.SpotMyGene.GenePie = function(params) {
  params = d3.SpotMyGene.defaults(params, d3.SpotMyGene.pieDefaultParameters);
  d3.SpotMyGene.Pie.call(this, params);
  d3.SpotMyGene.dispatch.on("updateSelectedGenes.pie" + this.id, (function(_this) {
    return function(selectedGenes) {
      _this.selectedObjectsBuffer = selectedGenes;
      return _this.render(selectedGenes, _this.accessorBuffer);
    };
  })(this));
  if (params.focusOnCellMouseover) {
    d3.SpotMyGene.dispatch.on("cellMouseover.pie" + this.id, (function(_this) {
      return function(cell, d) {
        var gene, targetId;
        gene = _this.map.get(d.geneId);
        if (gene != null) {
          targetId = _this.accessorBuffer(gene);
          return _this.chart.focus(targetId);
        }
      };
    })(this));
    d3.SpotMyGene.dispatch.on("cellMouseout.pie" + this.id, (function(_this) {
      return function(cell, d) {
        var gene;
        gene = _this.map.get(d.geneId);
        if (gene != null) {
          return _this.chart.focus();
        }
      };
    })(this));
  }
  return this;
};

d3.SpotMyGene.pieDefaultParameters = {
  container: '',
  colors: d3.scale.category20().range(),
  focusOnCellMouseover: true
};

d3.SpotMyGene._pieCount = 0;

d3.SpotMyGene.Pie = function(params) {
  var buildMap, currentIds, render;
  this.id = d3.SpotMyGene._pieCount;
  d3.SpotMyGene._pieCount++;
  currentIds = [];
  this.selectedObjectsBuffer = null;
  this.accessorBuffer = null;
  this.chart = c3.generate({
    bindto: params.container,
    data: {
      columns: [],
      type: 'pie'
    },
    color: {
      pattern: params.colors
    }
  });
  buildMap = function(objects) {
    var l, len, map, object;
    map = d3.map();
    for (l = 0, len = objects.length; l < len; l++) {
      object = objects[l];
      map.set(object.id, object);
    }
    return map;
  };
  render = (function(_this) {
    return function(objects, accessor) {
      var elt, idsToUnload, nest, newIds;
      _this.map = buildMap(objects);
      _this.selectedObjectsBuffer = objects;
      _this.accessorBuffer = accessor;
      nest = d3.nest().key(accessor).sortKeys(d3.ascending).entries(objects);
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
      _this.chart.load({
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
      _this.chart.unload({
        ids: idsToUnload
      });
      return currentIds = newIds;
    };
  })(this);
  this.dispatch = d3.dispatch('accessorChanged');
  this.dispatch.on('accessorChanged', (function(_this) {
    return function(accessor) {
      _this.accessorBuffer = accessor;
      return _this.render(_this.selectedObjectsBuffer, accessor);
    };
  })(this));
  this.render = render;
  return this;
};

d3.SpotMyGene.SamplePie = function(params) {
  d3.SpotMyGene.Pie.call(this, params);
  d3.SpotMyGene.dispatch.on("updateSelectedSamples.pie" + this.id, (function(_this) {
    return function(selectedGenes) {
      _this.selectedObjectsBuffer = selectedGenes;
      return _this.render(selectedGenes, _this.accessorBuffer);
    };
  })(this));
  return this;
};

d3.SpotMyGene.defaults = function(parameters, defaults) {
  var key, toReturn, value;
  toReturn = {};
  for (key in defaults) {
    value = defaults[key];
    if (key in parameters) {
      if (Object.prototype.toString.call(value) === '[object Array]') {
        toReturn[key] = parameters[key];
      } else if (typeof value === 'object') {
        if ((value != null) && Object.keys(value).length === 0) {
          toReturn[key] = parameters[key];
        } else {
          toReturn[key] = d3.SpotMyGene.defaults(parameters[key], value);
        }
      } else {
        toReturn[key] = parameters[key];
      }
    } else {
      toReturn[key] = value;
    }
  }
  return toReturn;
};

d3.SpotMyGene.Labels = (function() {
  var resize;

  resize = function(container, params) {
    var currentSize, labelHeight, maxWidth, scale, text;
    console.log(params);
    text = container.selectAll('text');
    labelHeight = container.select('text').node().getBBox().height;
    maxWidth = 0;
    text.each(function(label) {
      var width;
      width = d3.select(this).node().getBBox().width;
      if (width > maxWidth) {
        return maxWidth = width;
      }
    });
    scale = d3.min([params.step / labelHeight, params.width / maxWidth]);
    currentSize = parseFloat(container.style('font-size'));
    container.style('font-size', currentSize * scale);
    if (params.translate != null) {
      container.attr('transform', "translate(" + params.translate + ")");
    }
    return container.selectAll('text').attr('y', function(d, i) {
      labelHeight = d3.select(this).node().getBBox().height;
      return i * params.step + (labelHeight + params.step) / 2;
    });
  };

  function Labels(container, params) {
    this.container = container;
    this.params = params;
  }

  Labels.prototype.zoom = function(scale, translate) {
    var params;
    params = {
      height: this.params.heatmap.height,
      width: this.params.geneLabels.length,
      step: this.params.heatmap.cell.height * scale,
      translate: translate
    };
    return resize(this.container, params);
  };

  Labels.prototype._render = function(items, params) {
    var selection;
    selection = this.container.style('font-size', params.fontSize).selectAll('text').data(items, function(item) {
      return item.id;
    });
    selection.text(function(d) {
      return d.id;
    }).attr('x', params.width).style('font-size', params.fontSize);
    selection.exit().remove();
    selection.enter().append('text').text(function(d) {
      return d.id;
    }).attr('x', params.width).attr('text-anchor', 'end');
    resize(this.container, params);
    return selection;
  };

  return Labels;

})();

d3.SpotMyGene.GeneLabels = (function(superClass) {
  extend(GeneLabels, superClass);

  function GeneLabels(params, parentElement) {
    var container;
    container = parentElement.select('.gene-labels').append('g').attr('class', 'axis');
    GeneLabels.__super__.constructor.call(this, container, params);
  }

  GeneLabels.prototype.render = function(genes, params) {
    var container, selection, updateSelected;
    container = this.container;
    d3.SpotMyGene.dispatch.on('updateSelectedGenes.labels', function(selectedGenes, fromLabel) {
      var gene, ids;
      ids = (function() {
        var l, len, results;
        results = [];
        for (l = 0, len = selectedGenes.length; l < len; l++) {
          gene = selectedGenes[l];
          results.push(gene.id);
        }
        return results;
      })();
      if (!fromLabel) {
        return container.selectAll('text').each(function(d) {
          var ref;
          return d._selected = (ref = d.id, indexOf.call(ids, ref) >= 0);
        }).classed('selected', function(d) {
          return d._selected;
        });
      }
    });
    updateSelected = function() {
      var selectedGenes;
      container.selectAll('text').classed('selected', function(d) {
        return d._selected;
      });
      selectedGenes = container.selectAll('text').data().filter(function(gene) {
        return gene._selected;
      });
      return d3.SpotMyGene.dispatch.updateSelectedGenes(selectedGenes, true);
    };
    params = this.params;
    params = {
      height: params.heatmap.height,
      width: params.geneLabels.length,
      step: params.heatmap.cell.height,
      fontSize: 13
    };
    selection = this._render(genes, params);
    return d3.selectable(container, selection, updateSelected);
  };

  return GeneLabels;

})(d3.SpotMyGene.Labels);

d3.SpotMyGene.SampleLabels = function(params, parentElement) {
  var render, sampleLabels, updateSelected;
  sampleLabels = parentElement.select('.sample-labels').append('g').attr('class', 'x axis');
  d3.SpotMyGene.dispatch.on('updateSelectedSamples.labels', function(selectedSamples, fromLabel) {
    var gene, ids;
    ids = (function() {
      var l, len, results;
      results = [];
      for (l = 0, len = selectedSamples.length; l < len; l++) {
        gene = selectedSamples[l];
        results.push(gene.id);
      }
      return results;
    })();
    if (!fromLabel) {
      return sampleLabels.selectAll('text').each(function(d) {
        var ref;
        return d._selected = (ref = d.id, indexOf.call(ids, ref) >= 0);
      }).classed('selected', function(d) {
        return d._selected;
      });
    }
  });
  updateSelected = function() {
    var selectedSamples;
    sampleLabels.selectAll('text').classed('selected', function(d) {
      return d._selected;
    });
    selectedSamples = sampleLabels.selectAll('text').data().filter(function(sample) {
      return sample._selected;
    });
    return d3.SpotMyGene.dispatch.updateSelectedSamples(selectedSamples, true);
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
