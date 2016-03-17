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

var params = {
  genePie: {
    accessor: geneAccessors.type
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
