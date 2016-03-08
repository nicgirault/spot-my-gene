d3.SpotMyGene = function(data, params) {
  var instance;
  instance = new d3.SpotMyGene.Core(params);
  d3.SpotMyGene.validateParams(params, data);
  return instance.render2(data, params);
};

d3.SpotMyGene.Core = function(params) {
  this.params = params;
  return this;
};

d3.SpotMyGene.validateParams = function(params, data) {
  var heatmapWidth;
  heatmapWidth = params.width - params.geneLabels.length - params.geneDendogram.height;
  params.heatmap.cell.width = heatmapWidth / data.rows[0].values.length;
  params.sampleDendogram.width = heatmapWidth;
  if (params.maxHeight < params.heatmap.cell.height * data.rows.length) {
    return params.heatmap.cell.height = params.maxHeight / data.rows.length;
  }
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
  d3.select(".columns-labels text:nth-child(" + (i + 1) + ")").classed('active', true);
  return d3.select(".rows-labels text:nth-child(" + (j + 1) + ")").classed('active', true);
});

d3.SpotMyGene.dispatch.on('cellMouseout', function(cell, d, i, j) {
  d3.select(cell).classed('active', false);
  d3.select(".columns-labels text:nth-child(" + (i + 1) + ")").classed('active', false);
  return d3.select(".rows-labels text:nth-child(" + (j + 1) + ")").classed('active', false);
});

d3.SpotMyGene.buildColorScale = function(data) {
  var colors;
  colors = ['#005824', '#1A693B', '#347B53', '#4F8D6B', '#699F83', '#83B09B', '#9EC2B3', '#B8D4CB', '#D2E6E3', '#EDF8FB', '#FFFFFF', '#F1EEF6', '#E6D3E1', '#DBB9CD', '#D19EB9', '#C684A4', '#BB6990', '#B14F7C', '#A63467', '#9B1A53', '#91003F'];
  return d3.scale.quantile().domain([0, 3]).range(colors);
};

d3.SpotMyGene.renderColumnsLabels = function(parentElement, columns, params) {
  var container, label;
  container = parentElement.select('.sample-labels');
  label = container.selectAll('.label').data(columns).enter().append('text').text(function(d) {
    return d.name;
  }).attr('x', 0).attr('y', function(d, i) {
    return i * params.heatmap.cell.width;
  }).style('text-anchor', 'left').attr('transform', 'translate(' + params.heatmap.cell.width / 1.5 + ',-6) rotate (-90)').on('mouseover', function(d, i, j) {
    return d3.SpotMyGene.dispatch.sampleMouseover(d, i, j);
  }).on('mouseout', function(d, i, j) {
    return d3.SpotMyGene.dispatch.sampleMouseover(d, i, j);
  });
  d3.SpotMyGene.listenSampleMouseover(label, params);
  return parentElement;
};

d3.SpotMyGene.renderRowsLabels = function(parentElement, rows, params) {
  var container, label;
  container = parentElement.select('.gene-labels');
  label = container.selectAll('.label').data(rows).enter().append('text').attr('class', 'label').text(function(d) {
    return d.id;
  }).attr('x', 0).attr('y', function(d, i) {
    return i * params.heatmap.cell.height;
  }).style('text-anchor', 'end').attr("transform", "translate(-6," + params.heatmap.cell.height / 1.5 + ")").on('mouseover', function(d, i, j) {
    return d3.SpotMyGene.dispatch.geneMouseover(d, i, j);
  }).on('mouseout', function(d, i, j) {
    return d3.SpotMyGene.dispatch.geneMouseout(d, i, j);
  });
  d3.SpotMyGene.listenGeneMouseover(label, params);
  return parentElement;
};

d3.SpotMyGene.Core.prototype.render = function(svg, data, params) {
  var cell, colorScale, tree;
  if (!data) {
    return;
  }
  colorScale = d3.SpotMyGene.buildColorScale();
  svg = d3.SpotMyGene.renderRowsLabels(svg, data.rows, params);
  svg = d3.SpotMyGene.renderColumnsLabels(svg, data.columns, params);
  tree = [
    {
      children: [
        {
          children: [
            {
              children: [
                {
                  name: 'A'
                }, {
                  name: 'B'
                }
              ]
            }, {
              children: [
                {
                  name: 'C'
                }, {
                  name: 'D'
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  d3.SpotMyGene.renderDendogram(svg, tree, params);
  return cell = svg.select('.heatmap').selectAll('g').data(data.rows).enter().append('g').selectAll('rect').data(function(d) {
    return d.values;
  }).enter().append('rect').attr('class', 'cell').attr('x', function(d, i) {
    return i * params.heatmap.cell.width;
  }).attr('y', function(d, i, j) {
    return j * params.heatmap.cell.height;
  }).attr('width', params.heatmap.cell.width).attr('height', params.heatmap.cell.height).style('margin-right', 2).style('fill', colorScale).on('mouseover', function(d, i, j) {
    return d3.SpotMyGene.dispatch.cellMouseover(this, d, i, j);
  }).on('mouseout', function(d, i, j) {
    return d3.SpotMyGene.dispatch.cellMouseout(this, d, i, j);
  });
};

d3.SpotMyGene.Core.prototype.render2 = function(data, params) {
  var heatmap, svg;
  svg = d3.select(params.container).append('svg').style('width', params.width).style('height', params.heatmap.cell.height * data.rows.length + params.sampleLabels.length + params.sampleDendogram.height + params.margins.top);
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
  nodes = cluster.nodes(tree[0]);
  links = cluster.links(nodes);
  leaves = nodes.filter(function(node) {
    return node.name != null;
  });
  d3.SpotMyGene.resizeTree(width, leaves.length, nodes[0]);
  return svg.select('.sample-dendogram').selectAll('.link').data(links).enter().append('path').attr('class', 'link').attr('d', lineData);
};

d3.SpotMyGene.resizeTree = function(width, leavesNumber, root) {
  var cellWidth, index, setSize;
  cellWidth = width / leavesNumber;
  index = 0;
  setSize = function(node) {
    var child, k, len, ref;
    if (node.name != null) {
      node.x = cellWidth * index + cellWidth / 2;
      return index++;
    } else {
      ref = node.children;
      for (k = 0, len = ref.length; k < len; k++) {
        child = ref[k];
        setSize(child);
      }
      if (node.children.length === 1) {
        return node.x = node.children[0].x;
      } else {
        return node.x = (node.children[0].x + node.children[1].x) / 2;
      }
    }
  };
  return setSize(root);
};
