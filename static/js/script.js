// HEAVILY inspired (AKA copied from
// https://raw.githubusercontent.com/alignedleft/d3-book/master/chapter_14/17_labels.html
// From the great book: Interactive Data Visualization for the web. 
var h = 500;
var w = 500;

var projection = d3.geoMercator()
    .center([130, -20])
    .translate([w/2, h/2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

//Define what to do when panning or zooming
var zooming = function(d) {
    //console.log(d3.event.transform);

    //New offset array
    var offset = [d3.event.transform.x, d3.event.transform.y];
    console.log(offset);

    //Calculate new scale was 2000
    var newScale = d3.event.transform.k * 2000;

    //Update projection with new offset and scale
    projection.translate(offset)
        .scale(newScale);

    //Update all paths and circles
    svg.selectAll("path")
        .attr("d", path);

    svg.selectAll("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        });
}

//Then define the zoom behavior, translateExtent controls limits
var zoom = d3.zoom()
    .scaleExtent([ 0.2, 2.0 ])
    .translateExtent([[ -900, -1000 ], [ 900, 1000 ]])
    .on("zoom", zooming);

//The center of the country, roughly
//var center = projection([130, -30]);
var center = projection([130, -30]);

//Create a container in which all zoom-able elements will live
var map = svg.append("g")
    .attr("id", "map")
    .call(zoom)  //Bind the zoom behavior
    .call(zoom.transform, d3.zoomIdentity  //Then apply the initial transform
    .translate(w/2, h/2)
    .scale(0.25)
    .translate(-center[0], -center[1]));

//Create a new, invisible background rect to catch zoom events
map.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", w)
    .attr("height", h)
    .attr("opacity", 0);

// load the pub dataO
d3.json("static/data/aust.json", function(json) {
    map.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "black")
        .style("opacity", 0.1);


    d3.csv("static/data/data_filt2.csv", function(data) {
        map.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", 2)
            .style("fill", "orange")
            .append("title")
            .text(function(d) {
                return d.name + " " + d.sub_info;
            });
    createZoomButtons();
    });

    var createZoomButtons = function() {
        // Zoom in button shapes
        var zoomIn = svg.append("g")
            .attr("class", "zoom")	//All share the 'zoom' class
            .attr("id", "in")		//The ID will tell us which direction to head
            .attr("transform", "translate(" + (w - 110) + "," + (h - 70) + ")");

        zoomIn.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 30)
            .attr("height", 30);

        zoomIn.append("text")
            .attr("x", 15)
            .attr("y", 20)
            .text("+");

        var zoomOut = svg.append("g")
            .attr("class", "zoom")
            .attr("id", "out")
            .attr("transform", "translate(" + (w - 70) + "," + (h - 70) + ")");

        zoomOut.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 30)
            .attr("height", 30);

        zoomOut.append("text")
            .attr("x", 15)
            .attr("y", 20)
            .html("&ndash;");

        // Zooming action itself
        d3.selectAll(".zoom")
            .on("click", function() {
                //Set how much to scale on each click
                var scaleFactor;

                //Which way are we headed?
                var direction = d3.select(this).attr("id");

                //Modify the k scale value, depending on the direction
                switch (direction) {
                    case "in":
                        scaleFactor = 1.5;
                        break;
                    case "out":
                        scaleFactor = 0.75;
                        break;
                    default:
                        break;
            }

        //This triggers a zoom event, scaling by 'scaleFactor'
        map.transition()
            .call(zoom.scaleBy, scaleFactor);
        });
    };
});


//Bind 'Reset' button behavior
d3.select("#reset")
    .on("click", function() {
        map.transition()
            .call(zoom.transform,
        d3.zoomIdentity
        //Same
            .translate(w/2, h/2)
            .scale(0.25)
            .translate(-center[0], -center[1])
            );
});
