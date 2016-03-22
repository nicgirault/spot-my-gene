var geneAccessors, genePie, genePieAccessorChange, samplePie;

geneAccessors = {
  type: function(gene) {
    if (gene.id[gene.id.length - 1] === '1') {
      return 'Protein coding';
    }
    if (gene.id[gene.id.length - 1] === '2') {
      return 'Hormone';
    }
    if (gene.id[gene.id.length - 1] === '3') {
      return 'Marker';
    }
    if (gene.id[gene.id.length - 1] === '4') {
      return 'SiRNA';
    }
    if (gene.id[gene.id.length - 1] === '5') {
      return 'Cell cycle';
    }
    if (gene.id[gene.id.length - 1] === '6') {
      return 'Transcription factor';
    }
    if (gene.id[gene.id.length - 1] === '7') {
      return 'Antigen';
    }
    if (gene.id[gene.id.length - 1] === '8') {
      return 'Adhesion molecule';
    }
    if (gene.id[gene.id.length - 1] === '9') {
      return 'Ribozyme';
    }
    if (gene.id[gene.id.length - 1] === '0') {
      return 'Growth factor';
    }
    return 'Unknown';
  },
  tag: function(gene) {
    if (gene.id[gene.id.length - 1] === '1') {
      return 'tag A';
    }
    if (gene.id[gene.id.length - 1] === '2') {
      return 'tag A';
    }
    if (gene.id[gene.id.length - 1] === '3') {
      return 'tag A';
    }
    if (gene.id[gene.id.length - 1] === '4') {
      return 'tag B';
    }
    if (gene.id[gene.id.length - 1] === '5') {
      return 'tag B';
    }
    if (gene.id[gene.id.length - 1] === '6') {
      return 'tag C';
    }
    if (gene.id[gene.id.length - 1] === '7') {
      return 'tag D';
    }
    if (gene.id[gene.id.length - 1] === '8') {
      return 'tag D';
    }
    if (gene.id[gene.id.length - 1] === '9') {
      return 'tag D';
    }
    if (gene.id[gene.id.length - 1] === '0') {
      return 'No tag';
    }
    return 'Unknown';
  }
};

genePie = new d3.SpotMyGene.GenePie({
  container: '#gene-pie'
});

samplePie = new d3.SpotMyGene.SamplePie({
  container: '#sample-pie'
});

genePieAccessorChange = function(value) {
  return genePie.dispatch.accessorChanged(geneAccessors[value]);
};

d3.json('raw-data.json', function(data) {
  return async.map(data.st.samplesorder, (function(sampleId, done) {
    return d3.json('samples/' + sampleId + '.json', done);
  }), function(err, samples) {
    var cells, formatedData, geneId, genes, i, key, len, ref, ref1, row, sample, sampleIdx, value;
    cells = void 0;
    formatedData = void 0;
    geneId = void 0;
    genes = void 0;
    i = void 0;
    key = void 0;
    len = void 0;
    ref = void 0;
    ref1 = void 0;
    row = void 0;
    sample = void 0;
    sampleIdx = void 0;
    value = void 0;
    i = 0;
    len = samples.length;
    while (i < len) {
      sample = samples[i];
      sample.id = sample.name;
      i++;
    }
    genes = (function() {
      var results;
      results = void 0;
      results = [];
      for (key in data.ct) {
        key = key;
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
      geneId = geneId;
      row = ref[geneId];
      ref1 = row.count;
      for (sampleIdx in ref1) {
        sampleIdx = sampleIdx;
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
    d3.SpotMyGene(formatedData, {});
    genePie.render(genes, geneAccessors.type);
    return samplePie.render(samples, function(sample) {
      return sample.summary.sx;
    });
  });
});
