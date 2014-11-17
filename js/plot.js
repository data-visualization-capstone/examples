showHide = function(selector) {
  d3.select(selector).select('.hide').on('click', function(){
    d3.select(selector)
      .classed('visible', false)
      .classed('hidden', true);
  });

  d3.select(selector).select('.show').on('click', function(){
    d3.select(selector)
      .classed('visible', true)
      .classed('hidden', false);
  });
}

////////////////////////////////////////////
// Functions for filtering points by date //
////////////////////////////////////////////

// TODO: Make this function better 
// - should not work if no points are displayed  
// - should be able to display data for all days of selected month
// - should store month and corresponding number as key-value pair
//    september : 9, october : 10, etc. 

filter = function (month, day){
  $("circle").each(function(){
    var thisDate = $(this).attr("date").substring(0, 10).split("-"),
        thisMonth = Number(thisDate[1]),
        thisDay = Number(thisDate[2]);

    if(thisMonth != month && thisDay != day){
      $(this).parent("g").hide();
    } else if($(this).parent("g").css("display") == "none"){
      $(this).parent("g").show();
    }
  });
}
makeDays = function (month){
  var thirtyDay = [9, 4, 6, 11];
  for(i = 0; i < 3; i ++){
    if(Number(month) == thirtyDay[i]){
      for(i = 1; i < 31; i++){
        $("#day").append("<option>"+i+"</option>");
      }
    } 
    else if(Number(month) != 2){
      for(i = 1; i < 30; i++){
        $("#day").append("<option>"+i+"</option>");
      }
    }
    else{
      for(i = 1; i < 29; i++){
        $("#day").append("<option>"+i+"</option>");
      } 
    }
  }
}
$("#month").change(function(){
  makeDays($("#month").val());
});
$("#dateFilter").click(function(){
    filter($("#month").val(), $("#day").val());
  });
clearFilter = function (){
  $("circle").parent("g").show();
  $("#month").val("month");
  $("#day").val("day");
}

//////////////////////////////////
// Functions for drawing points //
//////////////////////////////////

drawPoints = function(map, url, initialSelections) {
  var pointTypes = d3.map(),
      points = [],
      lastSelectedPoint;

  var drawPointTypeSelection = function() {
    showHide('#selections')

    labels = d3.select('#toggles').selectAll('input')
      .data(pointTypes.values())
      .enter().append("label");

    labels.append("input")
      .attr('type', 'checkbox')
      .property('checked', function(d) {
        return initialSelections === undefined || initialSelections.has(d.type)
      })
      .attr("value", function(d) { return d.type; })
      .on("change", drawWithLoading);

    labels.append("span")
      .attr('class', 'key')
      .style('background-color', function(d) { return '#' + d.color; });

    labels.append("span")
      .text(function(d) { return d.type; });
  }

  var selectedTypes = function() {
    return d3.selectAll('#toggles input[type=checkbox]')[0].filter(function(elem) {
      return elem.checked;
    }).map(function(elem) {
      return elem.value;
    })
  }

  var pointsFilteredToSelectedTypes = function() {
    var currentSelectedTypes = d3.set(selectedTypes());
    return points.filter(function(item){
      return currentSelectedTypes.has(item.type);
    });
  }

  var drawWithLoading = function(e){
    d3.select('#loading').classed('visible', true);
    if (e && e.type == 'viewreset') {
      d3.select('#overlay').remove();
    }
    setTimeout(function(){
      draw();

      if($("#month").val() != "All Months" && $("#day").val() != "All Days"){
        filter($("#month").val(), $("#day").val());
      }      
      d3.select('#loading').classed('visible', false);
    }, 0);
  }

  var draw = function() {
    d3.select('#overlay').remove();
    var bounds = map.getBounds(),
        topLeft = map.latLngToLayerPoint(bounds.getNorthWest()),
        bottomRight = map.latLngToLayerPoint(bounds.getSouthEast()),
        existing = d3.set(),
        drawLimit = bounds.pad(0.4);

    filteredPoints = pointsFilteredToSelectedTypes().filter(function(d) {
      var latlng = new L.LatLng(d.latitude, d.longitude);

      if (!drawLimit.contains(latlng)) { return false };

      var point = map.latLngToLayerPoint(latlng);

      key = point.toString();
      if (existing.has(key)) { return false };
      existing.add(key);

      d.x = point.x;
      d.y = point.y;
      return true;
    });

    var svg = d3.select(map.getPanes().overlayPane).append("svg")
      .attr('id', 'overlay')
      .attr("class", "leaflet-zoom-hide")
      .style("width", map.getSize().x + 'px')
      .style("height", map.getSize().y + 'px')
      .style("margin-left", topLeft.x + "px")
      .style("margin-top", topLeft.y + "px");

    var g = svg.append("g")
      .attr("transform", "translate(" + (-topLeft.x) + "," + (-topLeft.y) + ")")
      .attr("pointer-events", "all");

    var svgPoints = g.attr("class", "points")
      .selectAll("g")
        .data(filteredPoints)
      .enter().append("g")
        .attr("class", "point")
        .style("z-index", 999);

    svgPoints.append("path")
      .attr("class", "point-cell")
      // .on('click', selectPoint)
      .classed("selected", function(d) { return lastSelectedPoint == d} );

    svgPoints.append("circle")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style('fill', function(d) { return '#' + d.color } )
      .attr("date", function(d) { return d.date })
      .attr("r", 2)
      .attr("pointer-events", "all");

    svgPoints.each(function(){

      if($(this).next().length == 1){
        var this_transform = $(this).children("circle").attr("transform"),
            next_transform = $(this).next().children("circle").attr("transform"),
            this_position = this_transform.substring(10, this_transform.length - 1).split(","),
            next_position = next_transform.substring(10, next_transform.length - 1).split(",");

        d3.select(this).append("line")
          .attr("x1", this_position[0])
          .attr("y1", this_position[1])
          .attr("x2", next_position[0])
          .attr("y2", next_position[1])
          .style("stroke", "rgb(255,0,0)")
          .style("stroke-width", "stroke-width:2")
          .style("opacity", "0");
      }
    });

    $("g").each(function(){
      $(this).hover(function(){
        var lines = [$(this).children("line"), $(this).next().children("line")],
            lines2 = [$(this).prev().children("line")];
        for(i=1; i < 5; i++){
          lines.push(lines[i].parent().next().children("line"));
        }
        for(i=0; i < 4; i++){
          lines2.push(lines2[i].parent().prev().children("line"));
        }
        lines = lines.concat(lines2);
        for(var x in lines){
          lines[x].css("opacity", 1);
        }
      },
      function(){
        var lines = [$(this).children("line"), $(this).next().children("line")],
            lines2 = [$(this).prev().children("line")];
        for(i=1; i < 5; i++){
          lines.push(lines[i].parent().next().children("line"));
        }
        for(i=0; i < 4; i++){
          lines2.push(lines2[i].parent().prev().children("line"));
        }
        lines = lines.concat(lines2);  
        for(var x in lines){
          lines[x].css("opacity", 0);
        }
      });
    });
  }

  var mapLayer = {
    onAdd: function(map) {
      map.on('viewreset moveend', drawWithLoading);
      drawWithLoading();
    }
  };

  // Points from XML
  map.on('ready', function() {
    console.log("Map Ready");

    loadData(function(data){
      console.log("Data Ready");
      
      // points = data.slice(0, 1000);
      points = data;
      
      points = _.map(points, function(point, key){
        
        var i = {
          color: "609128",
          id: key,
          date: point.date,
          latitude: point.location[1],
          longitude: point.location[0],
          name: key,
          type: "Josh",
          url: "..."
        }
        return i;
      })

      console.log(points[0])

      points.forEach(function(point) {
        pointTypes.set(point.type, {type: point.type, color: point.color});
      })
      
      drawPointTypeSelection();
      map.addLayer(mapLayer);
      
    });
  });
}