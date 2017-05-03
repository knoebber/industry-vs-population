// Set up the SVG
var svg_width = window.innerWidth;
var svg_height = window.innerHeight;

var projection = d3.geoAlbersUsa();
var path = d3.geoPath().projection(projection);
// Generate an SVG element on the page
var svg = d3.select("body").append("svg")
  .attr("width", svg_width - 50)
  .attr("height", svg_height)
    .attr('style', 'border:solid 3px #212121; padding: 30px 0; margin: 15px 0');


d3.json('us.json', function(error, usa) {
  svg.append('path')
     .datum(topojson.feature(usa, usa.objects.land))
     .attr('class', 'land')
     .attr('d', path);

  svg.append('g')
     .attr('class', 'state-boundries')
     .selectAll('path')
     .data(topojson.feature(usa, usa.objects.states).features)
     .enter()
     .append('path')
     .attr('fill','white')
     .attr('d', path)
      .attr('stroke', "#212121")
      .attr('stroke-width', 2);

});