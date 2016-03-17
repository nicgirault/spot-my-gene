var geneAccessors = {
  type: function(gene) {
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
  },
  tag: function(gene){
    if (gene.id[gene.id.length - 1] === "1") {
      return 'tag A';
    }
    if (gene.id[gene.id.length - 1] === "2") {
      return 'tag A';
    }
    if (gene.id[gene.id.length - 1] === "3") {
      return 'tag A';
    }
    if (gene.id[gene.id.length - 1] === "4") {
      return 'tag B';
    }
    if (gene.id[gene.id.length - 1] === "5") {
      return 'tag B';
    }
    if (gene.id[gene.id.length - 1] === "6") {
      return 'tag C';
    }
    if (gene.id[gene.id.length - 1] === "7") {
      return 'tag D';
    }
    if (gene.id[gene.id.length - 1] === "8") {
      return 'tag D';
    }
    if (gene.id[gene.id.length - 1] === "9") {
      return 'tag D';
    }
    if (gene.id[gene.id.length - 1] === "0") {
      return 'No tag';
    }
    return "Unknown";
  }
}

var genePieAccessorChange = function(value){
  d3.SpotMyGene.dispatch.genePieAccessorChanged(geneAccessors[value]);
};

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
      html = '<table class="c3-tooltip">';
      ref = d.summary;
      for (key in ref) {
        value = ref[key];
        html += "<tr><td>" + key + "</td><td> " + value + "</td></tr>";
      }
      html += '</table>';
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
    },
    colors: [
      '#E75753',
      '#FEFEFE',
      '#009688',
    ]
  },
  enableZoom: false,
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
  },
  genePie: {
    container: '#gene-pie',
    colors: [
      '#8dd3c7',
      '#ffffb3',
      '#bebada',
      '#fb8072',
      '#80b1d3',
      '#fdb462',
      '#b3de69',
      '#fccde5',
      '#d9d9d9',
      '#bc80bd',
      '#ccebc5',
      '#ffed6f',
    ],
    accessor: geneAccessors.type
  },
  samplePie: {
    container: '#sample-pie',
    colors: d3.scale.category20().range()
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
