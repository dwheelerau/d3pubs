// some code HEAVILY inspired AKA copied from
// https://raw.githubusercontent.com/alignedleft/d3-book/master/chapter_14/17_labels.html
// From the great book: Interactive Data Visualization for the web!  
var h = 500;
var w = 450;

// global data 
var globData;
// number of names to display
var numNames = 10;
// place to store 20 names for table
var names = [];

var projection = d3.geoMercator()
    .center([130, -25])
    .translate([w/2, h/2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

//Define what to do when panning or zooming
var zooming = function(d) {
    //New offset array
    var offset = [d3.event.transform.x, d3.event.transform.y];
    console.log(offset);

    //Calculate new scale was 2000
    var newScale = d3.event.transform.k * 2100;

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
    .scaleExtent([ 0.2, 10.0 ]) //act sets how much zoom
    .translateExtent([[ -900, -1000 ], [ 900, 1000 ]])
    .on("zoom", zooming);

//The center of our great country, roughly
var center = projection([130, -30]);

//Create a container in which all zoom-able elements will live
var map = svg.append("g")
    .attr("id", "mapg")
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
        .style("opacity", 0.15);

    d3.csv("static/data/data_filt2.csv", function(data) {
        globData = data;
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
        // get the top x number for table
        // MOVE THIS LOGIC TO A FUNCTION
        var table = document.getElementById('hotelTable');
        for (var i=0; names.length < numNames; i++) {
            var name = data[i]['name'];
            var freq = data[i]['freq'];
            if (names.includes(name) == false) {
                names.push(name);
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML = name;
                cell2.innerHTML = freq;
            }
        }
        d3.selectAll('td')
            .data(data)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);
    });

    var createZoomButtons = function() {
        // Zoom in button shapes
        var zoomIn = svg.append("g")
            .attr("class", "zoom")	//All share the 'zoom' class
            .attr("id", "in")		//The ID will tell us which direction to head
            .attr("transform", "translate(" + (w - 390) + "," + (h -70) + ")");

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
            .attr("transform", "translate(" + (w - 430) + "," + (h - 70) + ")");

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

//Bind 'Reset' button behavior, reloads screen....
d3.select("#reset")
    .on("click", function() {
        //map.transition()
        //    .call(zoom.transform,
        //d3.zoomIdentity
        //Same
        //    .translate(w/2, h/2)
        //    .scale(0.25)
        //    .translate(-center[0], -center[1])
        //    );
        //var table = document.getElementById('hotelTable');
        location.reload(true);
});
function mouseover(d) {
    var target = this.innerHTML;
    map.selectAll("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", function(d) {
            if (d.name == target) {
                return 3;
            } else {
                return 2;
            }
        })
        .style("fill", function(d) {
            if (d.name == target) {
                return "red";
            } else {
                return "orange";
            }
        });
}

function mouseout(d) {
    console.log('out');
    map.selectAll("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 2)
        .style("fill", "orange");
}

// work once the file is loaded.
d3.csv("static/data/postcode_pubs2.csv", function(pcData) {
    // collect the postcode to parse out the data from pcData and pass that
    d3.select("#button")
        .on("click", function() {

    var pc = document.getElementById("nValue").value
    // would be good to just send a obj of 20 values for table
    // updateTable(pcData, pc);
    var pcResult = {};
    // collect the 20 pub data for this postcode
    for (var i=0; i < pcData.length; i++) {
        if (pcData[i]['postcode'] == pc) {
            //pcResult = pcData[i];
           for (var n=0; n < names.length; n++) {
             pcResult[names[n]] = pcData[i][names[n]];
           }
        }
    }
    updateTable(pcResult);

    });
});

function updateTable(pcResult) { // this is a dictionary of all data, really want a object with just the
    // obj to store result with hotels as keys
    var table = document.getElementById('hotelTable');
    var rowsToDelete = table.rows.length;
    for (var i=0; i < rowsToDelete ; i++) {
        table.deleteRow(-1);
    }
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    // obj to make red dots for these 20
    // var locs = [{"name":[], "lon":[], "lat":[]}];
    var locs = [];
    cell1.innerHTML = "<strong>Pub</strong>";
    cell2.innerHTML = "<strong>Location (distance)</strong>";
    // insert each row
    for (var i=0; i < names.length; i++) {
        var name = names[i];
        var info = pcResult[name];
        var keyInfo = info.split(")")[0] + ")";
        // extract long and lat info and add to obj
        var lat = info.split(")")[1].split(" ")[1];
        var lon = info.split(")")[1].split(" ")[2];
        locs.push({"lat":lat, "lon":lon, "name":name});
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = name;
        cell2.innerHTML = keyInfo;
    }
    // add dots to maps for this table only
    map.selectAll("circle").remove(); // remove the dots
    map.selectAll("circle")
        .data(locs)
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
            return d.name;
        });
    console.log(locs);
    d3.selectAll('td')
       .data(globData)
       .on('mouseover', mouseover)
       .on('mouseout', mouseout);
}
