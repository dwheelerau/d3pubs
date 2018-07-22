var h = 300;
var w = 500;


var projection = d3.geo.conicConformal()
    .rotate([-132, 0])
    .center([0, -27])
    .parallels([-18, -36])
    .scale([500])
    .translate([w / 2, h / 2])
    .precision(0.1);

var path = d3.geoPath(projection);
// put color scale here

var svg = d3.select("body")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

// inset color function
// load the pub dataO
d3.csv("data/stat/data_filt.csv", function(data) {
    // load json
    d3.json('static/data/austraila.json', function(json) {
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d");
    });
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.cord1, d.cord2])[0];
        })
        .attr("cy", function(d) {
            return projection([d.cord1, d.cord2])[1];
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
