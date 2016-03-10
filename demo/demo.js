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
    length: 65,
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
  return async.map(data.st.samplesorder, function(sampleId, done) {
    return d3.json("samples/" + sampleId + ".json", done);
  }, function(err, samples) {
    var formatedData, genes, i, key, len, row, sample;
    for (i = 0, len = samples.length; i < len; i++) {
      sample = samples[i];
      sample.id = sample.uuid;
    }
    genes = (function() {
      var results;
      results = [];
      for (key in data.ct) {
        results.push({
          id: key,
          name: key,
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
});
