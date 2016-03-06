d3.SpotMyGene = function(data, params) {
  var instance;
  instance = new d3.SpotMyGene.Core(params);
  d3.SpotMyGene.validateParams(params, data);
  return instance.render(data, params);
};

d3.SpotMyGene.Core = function(params) {
  this.params = params;
  return this;
};

d3.SpotMyGene.validateParams = function(params, data) {
  var heatmapWidth;
  heatmapWidth = params.width - params.rows.labels.width;
  params.cell.width = heatmapWidth / data.rows[0].values.length;
  if (params.maxHeight < params.cell.height * data.rows.length) {
    return params.cell.height = params.maxHeight / data.rows.length;
  }
};

d3.SpotMyGene.dispatch = d3.dispatch('geneMouseover', 'sampleMouseover', 'geneMouseout', 'sampleMouseout', 'cellMouseover', 'cellMouseout');

d3.SpotMyGene.listenGeneMouseover = function(element, params) {
  if (params.rows.labels.showTooltips) {
    d3.SpotMyGene.geneTip = d3.tip().direction('s').offset([20, 0]).html(params.rows.labels.tooltipContent);
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
  if (params.columns.labels.showTooltips) {
    d3.SpotMyGene.sampleTip = d3.tip().direction('s').offset([20, 0]).html(params.columns.labels.tooltipContent);
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
  if (parentElement.select('.columns-labels').empty()) {
    container = parentElement.append('g').attr('class', 'columns-labels').attr('transform', 'translate(' + params.margins.left + ',' + params.margins.top + ')');
    label = container.selectAll('.label').data(columns).enter().append('text').text(function(d) {
      return d.name;
    }).attr('x', 0).attr('y', function(d, i) {
      return i * params.cell.width;
    }).style('text-anchor', 'left').attr('transform', 'translate(' + params.cell.width / 1.5 + ',-6) rotate (-90)').on('mouseover', function(d, i, j) {
      return d3.SpotMyGene.dispatch.sampleMouseover(d, i, j);
    }).on('mouseout', function(d, i, j) {
      return d3.SpotMyGene.dispatch.sampleMouseover(d, i, j);
    });
    d3.SpotMyGene.listenSampleMouseover(label, params);
  }
  return parentElement;
};

d3.SpotMyGene.renderRowsLabels = function(parentElement, rows, params) {
  var container, label;
  if (parentElement.select('.rows-labels').empty()) {
    container = parentElement.append('g').attr('class', 'rows-labels').attr('transform', 'translate(' + params.margins.left + ',' + params.margins.top + ')');
    label = container.selectAll('.label').data(rows).enter().append('text').attr('class', 'label').text(function(d) {
      return d.id;
    }).attr('x', 0).attr('y', function(d, i) {
      return i * params.cell.height;
    }).style('text-anchor', 'end').attr("transform", "translate(-6," + params.cell.height / 1.5 + ")").on('mouseover', function(d, i, j) {
      return d3.SpotMyGene.dispatch.geneMouseover(d, i, j);
    }).on('mouseout', function(d, i, j) {
      return d3.SpotMyGene.dispatch.geneMouseout(d, i, j);
    });
  }
  d3.SpotMyGene.listenGeneMouseover(label, params);
  return parentElement;
};

d3.SpotMyGene.Core.prototype.render = function(data, params) {
  var cell, colorScale, svg;
  svg = d3.select(params.container).append('svg').style('width', params.width);
  svg.selectAll('*').remove();
  if (!data) {
    return;
  }
  svg.style('height', params.cell.height * data.rows.length + params.columns.labels.height);
  colorScale = d3.SpotMyGene.buildColorScale();
  svg = d3.SpotMyGene.renderRowsLabels(svg, data.rows, params);
  svg = d3.SpotMyGene.renderColumnsLabels(svg, data.columns, params);
  return cell = svg.append('g').attr('transform', 'translate(' + params.rows.labels.width + ',' + params.columns.labels.height + ')').selectAll('g').data(data.rows).enter().append('g').selectAll('rect').data(function(d) {
    return d.values;
  }).enter().append('rect').attr('class', 'cell').attr('x', function(d, i) {
    return i * params.cell.width;
  }).attr('y', function(d, i, j) {
    return j * params.cell.height;
  }).attr('width', params.cell.width).attr('height', params.cell.height).style('margin-right', 2).style('fill', colorScale).on('mouseover', function(d, i, j) {
    return d3.SpotMyGene.dispatch.cellMouseover(this, d, i, j);
  }).on('mouseout', function(d, i, j) {
    return d3.SpotMyGene.dispatch.cellMouseout(this, d, i, j);
  });
};
