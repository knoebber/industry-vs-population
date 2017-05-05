// Set up the SVG
var svg_width = window.innerWidth;
var svg_height = window.innerHeight;

var projection = d3.geoAlbersUsa();
var path = d3.geoPath().projection(projection);
//coordinates of cities we will be looking at
var sanFranXY = projection([-122.4194,37.7749]); 
var detroitXY = projection([-83.04,42.33]);
var nDakotaXY = projection([-102.84,47.57]); 

function drawCircle(coordinates) {
  svg.selectAll('circle').remove();
  svg.append('circle')
     .attr('r',4)
     .attr('cx',coordinates[0])
     .attr('cy',coordinates[1])
     .attr('fill','none')
     .attr('stroke','red')
     .attr('stroke-width','2');
}

function updateYearSelect(data) {
  d3.select('#year-dropdown')
    .selectAll('option')
    .remove();

  d3.select('#year-dropdown')
    .selectAll('option')
    .data(data)
    .enter()
    .append('option')
    .attr('value', d => d.Year)
    .text(d=>d.Year);
}   
// Generate an SVG element on the page
var svg = d3.select('body').append('svg')
  .attr('width', svg_width - 50)
  .attr('height', svg_height)
  .attr('style', 'border:solid 3px #212121; padding: 30px 0; margin: 15px 0');


d3.queue()
  .defer(d3.json, 'us.json')
  .defer(d3.csv, 'data/detroit.csv')
  .defer(d3.csv, 'data/goldrush.csv')
  .defer(d3.csv, 'data/northdakotapop.csv')
  .await(function(error, usa, detroit,SF,ndakota) {

        if (error) console.error('error loading data: ' + error);
        else
        {

          d3.select('#industry-dropdown').on('change',function() { 
            var yearSelect = d3.select('#year-dropdown');
            switch(this.value){
              case 'automotive' :
               drawCircle(detroitXY); 
               updateYearSelect(detroit);
               break;
              case 'mining' :
                drawCircle(sanFranXY);
                updateYearSelect(SF);
                break;
              case 'oil' :
                drawCircle(nDakotaXY); 
                updateYearSelect(ndakota);
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
             .attr('stroke', '#212121')
             .attr('stroke-width', 2);
        }
});
