var h = 500;
var w = 500;

var projection = d3.geoMercator()
    .center([130, -30])
    .scale([500])
    .translate([w/2, h/2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

// load the pub dataO
d3.csv("static/data/data_filt.csv", function(data) {
    // load json
    d3.json("static/data/aust.json", function(json) {
        console.log(json.features.length);

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path);
        });

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                console.log(d);
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", 0.3)
            .style("fill", "yellow")
            .style("stroke", "gray")
            .style("stroke-width", 0.25)
            .style("opacity", 0.75)
            .append("title")         //Simple tooltip
            .text(function(d) {
                return d.name;
            });
});
