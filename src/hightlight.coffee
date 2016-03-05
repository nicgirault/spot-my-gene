hightlightOnMouseover = (cell, params) ->
  cell
  .on 'mouseover', (d) ->
    d3.select(@).classed('active', true)
    #   d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==rowLabel.indexOf(d.row);});
    # d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==colLabel.indexOf(d.col);});
  .on 'mouseout', (d) ->
    d3.select(this).classed('active',false)
    # d3.selectAll(".rowLabel").classed("text-highlight",false);
    # d3.selectAll(".colLabel").classed("text-highlight",false);
