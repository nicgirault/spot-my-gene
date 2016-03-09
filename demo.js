var params;

params = {
  container: '#chart',
  width: 800,
  maxHeight: 2000,
  margins: {
    left: 10,
    top: 10
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
    }
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
    }
  },
  sampleDendogram: {
    height: 400
  },
  geneDendogram: {
    height: 200
  },
  heatmap: {
    cell: {
      height: 30
    }
  }
};

d3.json('raw-data.json', function(data) {
  var formatedData, genes, key, row, samples;
  samples = (function() {
    var i, len, ref, results;
    ref = data.st.samplesorder;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      results.push({
        id: key,
        name: key,
        summary: {
          test: 'value'
        }
      });
    }
    return results;
  })();
  genes = (function() {
    var results;
    results = [];
    for (key in data.ct) {
      results.push({
        id: key,
        metadata: {
          yolo: 'value'
        }
      });
    }
    return results;
  })();
  formatedData = {
    samples: samples,
    genes: genes,
    matrix: (function() {
      var ref, results;
      ref = data.ct;
      results = [];
      for (key in ref) {
        row = ref[key];
        results.push(row.count);
      }
      return results;
    })()
  };
  return d3.SpotMyGene(formatedData, params);
});
