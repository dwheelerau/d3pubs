var h = 300;
var w = 500;

//var projection = d3.geoMercator()
//    .scale(4000)
//    .center([2.8, 41.9])
//    .translate([w/2, h/2]);

var projection = d3.geoMercator()
    .translate([w / 2, h / 2])
    .scale([500]);

// var path = d3.geoPath(projection);
// put color scale here
var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

// load the pub dataO
d3.csv("static/data/data_filt.csv", function(data) {
    // load json
    d3.json("static/data/au-states.geojson", function(error, australia) {
        if (error) throw error;
        svg.selectAll("path")
            .data(australia.features)
            .enter()
            .append("path")
            .attr("d");
        });
        //svg.selectAll("circle")
        //.data(data)
        //.enter()
        //.append("circle")
        //.attr("cx", function(d) {
        //    return projection([d.cord1, d.cord2])[0];
        //})
        //.attr("cy", function(d) {
        //    return projection([d.cord1, d.cord2])[1];
        //})
        //.attr("r", 0.3)
        //.style("fill", "yellow")
        //.style("stroke", "gray")
        //.style("stroke-width", 0.25)
        //.style("opacity", 0.75)
        //.append("title")         //Simple tooltip
        //.text(function(d) {
        //    return d.name;
        //});
});
