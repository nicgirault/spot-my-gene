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

d3.SpotMyGene.addTooltips = function(element, getContent) {
  var tip;
  tip = d3.tip().direction('s').offset([20, 0]).html(getContent);
  return element.call(tip).on('mouseover', function(d) {
    return tip.attr('class', 'd3-tip appear').show(d);
  }).on('mouseout', function(d) {
    tip.attr('class', 'd3-tip').show(d);
    return tip.hide();
  });
};

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
    }).style('text-anchor', 'left').attr('transform', 'translate(' + params.cell.width / 1.5 + ',-6) rotate (-90)');
    if (params.columns.labels.showTooltips) {
      d3.SpotMyGene.addTooltips(label, params.columns.labels.tooltipContent);
    }
  }
  return parentElement;
};

d3.SpotMyGene.renderRowsLabels = function(parentElement, rows, params) {
  var container, label;
  if (parentElement.select('.rows-labels').empty()) {
    container = parentElement.append('g').attr('class', 'rows-labels').attr('transform', 'translate(' + params.margins.left + ',' + params.margins.top + ')');
    label = container.selectAll('.label').data(rows).enter().append('text').text(function(d) {
      return d.id;
    }).attr('x', 0).attr('y', function(d, i) {
      return i * params.cell.height;
    }).style('text-anchor', 'end').attr("transform", "translate(-6," + params.cell.height / 1.5 + ")");
    if (params.rows.labels.showTooltips) {
      d3.SpotMyGene.addTooltips(label, params.rows.labels.tooltipContent);
    }
  }
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
  }).attr('width', params.cell.width).attr('height', params.cell.height).style('margin-right', 2).style('fill', colorScale);
};
