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
    length: 100,
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
    var cells, formatedData, geneId, genes, i, key, len, ref, ref1, row, sample, sampleIdx, value;
    for (i = 0, len = samples.length; i < len; i++) {
      sample = samples[i];
      sample.id = sample.name;
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
    cells = [];
    ref = data.ct;
    for (geneId in ref) {
      row = ref[geneId];
      ref1 = row.count;
      for (sampleIdx in ref1) {
        value = ref1[sampleIdx];
        cells.push({
          geneId: geneId,
          sampleId: samples[sampleIdx].id,
          value: value
        });
      }
    }
    formatedData = {
      samples: samples,
      genes: genes,
      cells: cells
    };
    return d3.SpotMyGene(formatedData, params);
  });
});
