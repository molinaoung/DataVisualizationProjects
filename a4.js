
function createBaseMap(mapData, divId, svg) {
    if (! svg) {
        svg = d3.select(divId).append("svg")
            .attr("width", 400)
            .attr("height", 600);
    }
	

    var districts = [101,  102,  103,  104,  105,  106,  107,  108,  109,  110, 111,  164,  301,  302,  303,  306,  307,  308,  309,  355,  401, 402];
    mapData.features = mapData.features.filter(d => districts.includes(d.properties.communityDistrict));

    var proj = d3.geoMercator().fitSize([svg.attr('width'),svg.attr('height')],mapData);
    var path = d3.geoPath().projection(proj);

    svg.selectAll(".district")
        .data(mapData.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "district")
        .style("stroke", "black")
        .style("stroke-width", 0.25)
        .append("title").text(function(d) { return d.properties.communityDistrict; });

    return svg;
}
function createRightLinkMap(mapData, divId, svg) {
    if (! svg) {
        svg = d3.select(divId).append("svg")
            .attr("width", 400)
            .attr("height", 600);
    }

    var districts = [101,  102,  103,  104,  105,  106,  107,  108,  109,  110, 111,  164,  301,  302,  303,  306,  307,  308,  309,  355,  401, 402];
    mapData.features = mapData.features.filter(d => districts.includes(d.properties.communityDistrict));

    var proj = d3.geoMercator().fitSize([svg.attr('width'),svg.attr('height')],mapData);
    var path = d3.geoPath().projection(proj);

    svg.selectAll(".district")
        .data(mapData.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "district")
        .style("stroke", "black")
        .style("stroke-width", 0.4)
        .on("mouseover",function(d){
			d3.select(this)
				.style("stroke", "yellow")
				.style("stroke-width", 4)
				highlightedMaps2(d.properties.communityDistrict);
        })
        .on("mouseout",function(){
			d3.select(this)
				.style("stroke", "black")
				.style("stroke-width", .4)
		var colorLeft = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(startCounts.get("total").values())]);
		startMap.selectAll(".district")
        .style("fill", d => colorLeft(startCounts.get("total").get(+d.properties.communityDistrict) || 0));
		var colorRight = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(startCounts.get("total").values())]);
		endMap.selectAll(".district")
        .style("fill", d => colorLeft(startCounts.get("total").get(+d.properties.communityDistrict) || 0));
		})
        .append("title").text(function(d) {return d.properties.communityDistrict; });


    return svg;
}
function createLeftLinkMap(mapData, divId, svg) {
    if (! svg) {
        svg = d3.select(divId).append("svg")
            .attr("width", 400)
            .attr("height", 600);
    }
	
	var districts = [101,  102,  103,  104,  105,  106,  107,  108,  109,  110, 111,  164,  301,  302,  303,  306,  307,  308,  309,  355,  401, 402];
    mapData.features = mapData.features.filter(d => districts.includes(d.properties.communityDistrict));

    var proj = d3.geoMercator().fitSize([svg.attr('width'),svg.attr('height')],mapData);
    var path = d3.geoPath().projection(proj);

    svg.selectAll(".district")
        .data(mapData.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "district")
        .style("stroke", "black")
        .style("stroke-width", 0.4)
        .on("mouseover",function(d){
			d3.select(this)
				.style("stroke-width", 4)
				.style("stroke", "yellow")
				highlightedMaps1(d.properties.communityDistrict);
        })
        .on("mouseout",function(){
			 d3.select(this)
				.style("stroke-width", .4)
				.style("stroke", "black")
				highlightedMaps1();
				var colorLeft = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(startCounts.get("total").values())]);
				startMap.selectAll(".district")
				.style("fill", d => colorLeft(startCounts.get("total").get(+d.properties.communityDistrict) || 0));
				var colorRight = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(startCounts.get("total").values())]);
				endMap.selectAll(".district")
				.style("fill", d => colorLeft(startCounts.get("total").get(+d.properties.communityDistrict) || 0));
        })
    .append("title").text(function(d) {return d.properties.communityDistrict; });

    return svg;
}
function createDayCounts(bikeData, key) {
    return d3.nest()
        .key(d => d.day)
        .key(d => d[key])
        .rollup(arr => arr.reduce((s, d) => s + (+d.count), 0))
        .map(bikeData);
}

function createDistrictCounts(bikeData, key1, key2) {
    var districtCounts = d3.nest()
        .key(d => d[key1])
        .key(d => d[key2])
        .rollup(arr => arr.reduce((s, d) => s + (+d.count), 0))
        .map(bikeData);

    var districtTotals = d3.nest()
        .key(d => d[key2])
        .rollup(arr => arr.reduce((s, d) => s + (+d.count), 0))
        .map(bikeData);

    districtCounts.set("total", districtTotals);
    return districtCounts;
}
function createDayChoropleths(mapData, bikeData) {
    var startMap = createBaseMap(mapData, "#day-start-map");
    var endMap = createBaseMap(mapData, "#day-end-map");

    var startCounts = createDayCounts(bikeData, "startDistrict");
    var endCounts = createDayCounts(bikeData, "endDistrict");

    // Currently just shows July 1 Data!
    // Need to update/refactor so that there is a slider such that when the slider
    // value is changed, the maps are updated to reflect that day's data
	
	var sValue = document.getElementById("day");
	var slider = document.getElementById("my_slider");
	sValue.innerHTML= slider.value;
	
	slider.oninput = function(){
		sValue.innerHTML = this.value;
		var maxCount = Math.max(d3.max(startCounts.values(), d => d3.max(d.values())),
			d3.max(endCounts.values(), d => d3.max(d.values())));
		var dayColor = d3.scaleSequential(d3.interpolateBlues).domain([0, maxCount]);
		startMap.selectAll(".district")
			.style("fill", d => dayColor(startCounts.get(this.value).get(+d.properties.communityDistrict) || 0))
			.select("title").text(d => startCounts.get(this.value).get(+d.properties.communityDistrict));
		endMap.selectAll(".district")
			.style("fill", d => dayColor(endCounts.get(this.value).get(+d.properties.communityDistrict) || 0))
			.select("title").text(d => endCounts.get(this.value).get(+d.properties.communityDistrict));
	}
	
	
	var maxCount = Math.max(d3.max(startCounts.values(), d => d3.max(d.values())),
        d3.max(endCounts.values(), d => d3.max(d.values())));
	var dayColor = d3.scaleSequential(d3.interpolateBlues).domain([0, maxCount]);
    startMap.selectAll(".district")
        .style("fill", d => dayColor(startCounts.get(1).get(+d.properties.communityDistrict) || 0))
	endMap.selectAll(".district")
        .style("fill", d => dayColor(endCounts.get(1).get(+d.properties.communityDistrict) || 0))
}
function createSourceDestLinked(mapData, bikeData) {
  var district;

    startMap = createLeftLinkMap(mapData, "#linked-start-map");
    endMap = createRightLinkMap(mapData, "#linked-end-map");

    startCounts = createDistrictCounts(bikeData, "startDistrict", "endDistrict");
    endCounts = createDistrictCounts(bikeData, "endDistrict", "startDistrict");

    // Currently, just shows the totals on the left and the 101 destination counts on the right
    // Need to update this so that
    //  (a) hovering over a district on the left shows the destination counts on the right
    //  (b) hovering over a district on the right shows the source counts on the left


    var colorLeft = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(startCounts.get("total").values())]);
    startMap.selectAll(".district")
        .style("fill", d => colorLeft(startCounts.get("total").get(+d.properties.communityDistrict) || 0));


    var colorRight = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(startCounts.get("total").values())]);
    endMap.selectAll(".district")
        .style("fill", d => colorLeft(startCounts.get("total").get(+d.properties.communityDistrict) || 0));

}
function highlightedMaps1(district){
  if(district == null){
    var colorLeft = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(startCounts.get("total").values())]);
    startMap.selectAll(".district")
        .style("fill", d => colorLeft(startCounts.get("total").get(+d.properties.communityDistrict) || 0));
  }else{
  var colorRight = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(endCounts.get(district).values())]);
  endMap.selectAll(".district")
      .style("fill", d => colorRight(startCounts.get(district).get(+d.properties.communityDistrict) || 0));
    }
}
function highlightedMaps2(district){
  if(district == null){

  }else{
    var colorRight = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(startCounts.get(district).values())]);
    startMap.selectAll(".district")
        .style("fill", d => colorRight(endCounts.get(district).get(+d.properties.communityDistrict) || 0));

  }


}
function createMapNetwork(mapData, bikeData, minTrips) {
    var counts = d3.nest()
        .key(d => d.startDistrict)
        .key(d => d.endDistrict)
        .rollup(arr => arr.reduce((s, d) => s + (+d.count), 0))
        .map(bikeData);

    var nodes = counts.keys().map(d => ({name: d}));
    var lookup = d3.map(nodes, d => d.name);
    var links = counts.entries().reduce(
        (s,d) => s.concat(d.value.entries()
            .filter(dd => ((d.key != dd.key) && (dd.value >= minTrips)))
            .map(dd => (
                {
                    source: lookup.get(d.key),
                    target: lookup.get(dd.key),
                    count: dd.value
                }))), []);

    var w = 1000;
    var h = 1000;
    var padding = 60;

    svg = d3.select("#map-network").append("svg")
        .attr("width", w)
        .attr("height", h);

    //Create edges as lines
    var edges = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .attr("class", "link");

    function dragstarted(d) {
        if (!d3.event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    var nodeGroups = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // UPDATE: create a mini map here instead of the circles
    nodeGroups.append("circle")
        .attr("r", 10)
        .style("fill", "createLeftLinkMap")
        .style("stroke", "blue")
        .style("stroke-width", 1);

    // UPDATE: include collision
    var sim = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.name))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(w / 2, h / 2));

    sim.nodes(nodes)
        .on("tick", function () {
            edges.attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

            nodeGroups.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        });

    // UPDATE: include link strength
    sim.force("link")
        .links(links);
}
function createVis(data) {
    var mapData = data[0], bikeData = data[1];

    createDayChoropleths(mapData, bikeData);
    createSourceDestLinked(mapData, bikeData);
    createMapNetwork(mapData, bikeData, 750);
}
Promise.all([d3.json("https://gitcdn.xyz/repo/dakoop/fb4d65af84db0ee3f2233e02cdeb1874/raw/9a819d894ff29f786b61b7c3d0fa18f84b244362/nyc-community-districts.geojson"),
    d3.csv('https://gitcdn.xyz/repo/dakoop/69f3c7132f4319c62a296897a2f83d0c/raw/995bed69e03fc2d91fc62ed8530c2df6061db716/bikeTripData.csv')])
    .then(createVis);
