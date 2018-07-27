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
d3.json("static/data/aust.json", function(json) {
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "black")
        .style("opacity", 0.1);


    d3.csv("static/data/data_filt2.csv", function(data) {
        console.log(data);
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", 0.9)
            .style("fill", "red")
            .append("title")
            .text(function(d) {
                console.log(d.sub_info);
                return d.name + " " + d.sub_info;
            });
            //.on("mouseover", mouseover)
            //.on("mouseout", mouseout);
    createZoomButtons();
    });

    function mouseover(d) {
        d3.select("#tooltip")
            .select("value")
            .text("test");
        d3.select("#tooltip").classed("hidden", false);
        d3.select("#tootlip")
            .style("top", (event.pageY-10) + "px")
            .style("left", (event.pageX-10) + "px");
    }

    function mouseout(d) {
        d3.select("#tooltip").classed("hidden", "true");
    }

    //Create zoom buttons
    var createZoomButtons = function() {
        //Create the clickable groups

        //Zoom in button
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

        //Zoom out button
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

        //Zooming interaction

        d3.selectAll(".zoom")
            .on("click", function() {
            console.log('testtsts');
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


