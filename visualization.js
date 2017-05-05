// Set up the SVG
var svg_width = window.innerWidth;
var svg_height = window.innerHeight;

var projection = d3.geoAlbersUsa();
var path = d3.geoPath().projection(projection);
//coordinates of cities we will be looking at
var sanFranXY = projection([37.46,122.55]); //these seem to be wrong
var detroitXY = projection([-83.04,42.33]);
var nDakotaXY = projection([47.57,102.84]); //and this oen
console.log(sanFranXY);
console.log(detroitXY);
console.log(nDakotaXY);

// Generate an SVG element on the page
var svg = d3.select("body").append("svg")
  .attr("width", svg_width - 50)
  .attr("height", svg_height)
  .attr('style', 'border:solid 3px #212121; padding: 30px 0; margin: 15px 0');


d3.queue()
  .defer(d3.json, "us.json")
  .defer(d3.csv, "data/detroit.csv")
  .defer(d3.csv, "data/goldrush.csv")
  .defer(d3.csv, "data/northdakotapop.csv")
  .await(function(error, usa, detroit,SF,ndakota) {

        if (error) console.error('error loading data: ' + error);
        else
        {

          d3.select("#dropdown").on('change',function() { 
            switch(this.value){
              case 'automotive' :
                svg.append('circle')
                   .attr('r',4)
                   .attr('cx',detroitXY[0])
                   .attr('cy',detroitXY[1])
                   .attr('fill','none')
                   .attr('stroke','red')
                   .attr('stroke-width','2');
                break;
                }
          });

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
        }
});
