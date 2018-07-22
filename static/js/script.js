// define path generator
var h = 500;
var w = 700;

// load json
d3.json('austraila.json', function(json) {
    makeVis(json);
});

function makeVis(json)
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d");

    var projection= d3.geoAlbersUsa()
            .translate([w/2, h/2])
            .scale([500]);
    var path = d3.geoPath(projection);
    // inset color function
    d3.csv("data/stat/data_filt.csv", function(data) {
        // code goes here
    });
