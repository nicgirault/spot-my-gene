params = {
  container: '#chart',
  width: 800,
  maxHeight: 600,
  margins: {
    left: 10,
    top: 10,
  },
  sampleLabels: {
    length: 30,
    showTooltips: true,
    tooltipContent: function(d) {
      var html, key, ref, value;
      html = '<ul>';
      ref = d.summary;
      for (key in ref) {
        value = ref[key];
        html += "<li><b>" + key + "</b>: " + value + "</li>";
      }
      html += '</ul>';
      return html;
    },
  },
  geneLabels: {
    length: 30,
    showTooltips: true,
    tooltipContent: function(d) {
      var html, key, ref, value;
      html = '<ul>';
      ref = d.metadata;
      for (key in ref) {
        value = ref[key];
        html += "<li><b>" + key + "</b>: " + value + "</li>";
      }
      html += '</ul>';
      return html;
    },
  },
  sampleDendogram: {
    height: 200,
  },
  geneDendogram: {
    height: 200,
  },
  heatmap: {
    cell: {
      height: 30
    },
  }
};

d3.SpotMyGene({
  columns: [
    {
      name: '1',
      summary: {
        name: '1'
      },
    },
    {
      name: '2',
      summary: {
        name: '2'
      },
    },
    {
      name: '3',
      summary: {
        name: '3'
      },
    },
    {
      name: '4',
      summary: {
        name: '4'
      },
    },
  ],
  rows: [
    {
      id: "A",
      values: [0,1,2,3],
      metadata: {
        name: "A"
      }
    },
    {
      id: "B",
      values: [3,2,1,0],
      metadata: {
        name: "B"
      }
    },
  ]
}, params);
