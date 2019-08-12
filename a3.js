
//Part 1
function createMap1(data, divId, projection, w, h, stationData) {
  //Create SVG element
  var mapSvg = d3.select(divId).append("svg")
  	.attr("width", w)
	  .attr("height", h);

  var path = d3.geoPath()
    .projection(projection);
  
  mapSvg.selectAll("path")
	.data(data)
	.enter().append("path")
    .attr("d", path)
    .style("stroke", "black")
    .style("fill", "#ccc");
	
  mapSvg.selectAll("path")
  .data(stationData)
	.enter().append("path")
    .attr("d", path)
    .style("fill", "rgba(255, 0, 0, .5)");
}
//Part 2
function createMap2(divId, w2, h2, stationData) {
	//Create SVG element
	 var mapSvg = d3.select(divId).append("svg")
  	.attr("width", w2)
	.attr("height", h2);
	

	const margin = ({top:10, right:10, bottom: 35, left: 20});
	const bikeMax = d3.max(stationData.map(d => parseInt(d.availableBikes)));
	const dockMax = d3.max(stationData.map(d => parseInt(d.availableDocks)));
	
	//yscale
	var yScale = d3.scaleLinear()
		.domain([0, dockMax])
		.range([h2 - margin.bottom, margin.top])
		
	//xscale	
	var xScale = d3.scaleLinear()
		.domain([0, bikeMax])
		.range([margin.left + 40, w2 ]);
	const color = d3.scaleOrdinal().domain(["1","3","4"]).range(d3.schemeSet2);
	
	mapSvg.append("g").selectAll("circle")
	.data(stationData.map(d => [d.availableBikes, d.availableDocks, d.district[0]]))
	.enter().append("circle")
	.attr("cx", (d) => xScale(d[0]))
	.attr("cy", (d) => yScale(d[1]))
	.attr("r", "2.9")
	.attr("fill", d => color(d[2]))
	
	
	// Add  x scales to axis
    var xAxis = g => {
		g.call(d3.axisBottom()
                   .scale(xScale))
		g.append("text")
		.text("Available Bikes")
		.attr("x", w2/2)
		.attr("y", 32)
		.attr("fill", "blue")
		.attr("font-size", 12)
	}
    //Append group and insert axis
    mapSvg.append("g")
	   .attr("transform", "translate("+(margin.left-25)+","+(h2 - 30)+")")
       .call(xAxis);
	
     // Add y scales to axis
    var yAxis = g => {
		g.call(d3.axisLeft()
                 .scale(yScale));
			g.append("text")
			.text("Available Docks")
			.attr("transform", "rotate(-90)")
			.attr("x", 0 - (h2/2))
			.attr("y", 0 - margin.left)
			.attr("fill", "blue")
			.style("text-anchor", "middle")
			.attr("font-size", 12)
	}
	//Append group and insert axis
    mapSvg.append("g")
       .attr("transform", "translate(50,0)")
       .call(yAxis);	
	
}

//part 3
function createMap3(data, divId, projection, w3, h3, stationData) {
	  //Create SVG element
  var mapSvg = d3.select(divId).append("svg")
  	.attr("width", w3)
	  .attr("height", h3);

  var path = d3.geoPath()
    .projection(projection);
	
	//console.log(stationData);
	const color = d3.scaleSequential(d3.interpolateRdYlBu).domain([0,1]); 
	//var sum = ["1", "3", "4"].map(d => stationData.filter(e => (e.district[0])=== d ).reduce((a,c) => a + parseInt (c.availableBikes), 0));
	//var sum2 = ["1", "3", "4"].map(d => stationData.filter(e => (e.district[0])=== d ).reduce((a,c) => a + parseInt (c.availableDocks), 0));
	//console.log(sum);
	
	mapSvg.selectAll("path")
	.data(data)
	.enter().append("path")
	.attr("d", path)
	.attr("data-bikes", (d) => (stationData.filter(e => parseInt(e.district) === d.properties.communityDistrict).reduce((ac,cv) => ac += parseInt(cv.availableBikes), 0)))
	.attr("data-docks", (d) => (stationData.filter(e => parseInt(e.district) === d.properties.communityDistrict).reduce((ac,cv) => ac + parseInt(cv.totalDocks), 0)))
	.attr("data-ratio", (d,i,n) => (parseInt(n[i].getAttribute("data-bikes"))/parseInt(n[i].getAttribute("data-docks"))))//grabs bikes and docks and dividing them to get the ratio
	.attr("fill", (d,i,n) => (color(parseFloat(n[i].getAttribute("data-ratio"))))); //converts from a string to a float and passes to color
 
  //console.log(data);
}

function processData(data) {
 mapData = data[0];
 stationData = data[1];
  var w = 600;
  var h = 600;
  var stationFilter = stationData.filter(d => d.district !== "-999")
  var stationMap = stationFilter.map(d => ({type: "Point", coordinates:[d.longitude, d.latitude]}))
 
  
  const valid_districts = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 164, 301, 302, 303, 306, 307, 308, 309, 355, 401, 402];
  const features = mapData.features.filter(f => valid_districts.includes(f.properties.communityDistrict));
  // just use the main US projection
  console.log(features);
  var projection1 = d3.geoAlbersUsa()
	.fitSize([w,h], {type:"FeatureCollection", features})
  const path = d3.geoPath().projection(projection1);
 
 
  createMap1(features, "#station-map", projection1, w, h, stationMap);
  createMap2("#scatterplot", w, h, stationFilter);
  createMap3(features, "#availability-map", projection1, w, h, stationFilter)
}

// this loads the data and calls the createVis function
Promise.all([d3.json("https://gitcdn.xyz/repo/dakoop/fb4d65af84db0ee3f2233e02cdeb1874/raw/9a819d894ff29f786b61b7c3d0fa18f84b244362/nyc-community-districts.geojson"),
    d3.csv("https://gitcdn.xyz/repo/dakoop/fb4d65af84db0ee3f2233e02cdeb1874/raw/bb31d4c41bda64891455a68741accdfef40aeef3/bikeStationData.json")]).then(processData);

