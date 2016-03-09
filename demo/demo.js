params = {
  container: '#chart',
  width: 800,
  maxHeight: 2000,
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
    height: 400,
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
d3.json('demo/raw-data.json', function(data){
  formatedData = {};
  formatedData.columns = [];
  for (id in data.st.samplesorder) {
    formatedData.columns.push({
      name: id,
      summary: {
        test: 'value'
      }
    });
  }
  formatedData.rows = [];
  for (key in data.ct) {
    formatedData.rows.push({
      id: key,
      values: data.ct[key].count,
      metadata: {
        yolo: 'yolo value'
      }
    })
  }
  d3.SpotMyGene(formatedData, params);
});
