// Set up the SVG
var svg_width = window.innerWidth;
var svg_height = window.innerHeight;

var projection = d3.geoAlbersUsa();
var path = d3.geoPath().projection(projection);
//coordinates of cities we will be looking at
var sanFranXY = projection([-122.4194,37.7749]); 
var detroitXY = projection([-83.04,42.33]);
var nDakotaXY = projection([-102.84,47.57]);

var currentIdustry = null;

function getPopnBound(cityData){
    var min = 0, max = 0;
    for(var x = 0; x < cityData.length; x++) {
        min = Math.min(min, cityData[x].Population);
        max = Math.max(max, cityData[x].Population);
    }
    return {
        min:min, max:max
    };
}

function calculateCircleSize(population, bounds) {
    return (population - bounds.min) / (bounds.max - bounds.min) * 20 * 2.5;

}

function drawCircle(coordinates, population, bounds) {
  svg.selectAll('circle').remove();
  svg.append('circle')
     .attr('r', calculateCircleSize(population, bounds))
     .attr('cx',coordinates[0])
     .attr('cy',coordinates[1])
     .attr('fill','#212121')
     .attr('stroke','#949494')
     .attr('stroke-width','3')
      .attr('cursor','pointer');
}

/**
 * updates the year select options
 * @param data
 */
function updateYearSelect(data) {
    //d3.select('#year-dropdown').selectAll('option').remove();
    d3.select('#year-dropdown')
        .selectAll('option')
        .data(data)
        .enter()
        .append('option')
        .attr('value', (d, i) => i)
.text(d=>d.Year);
}

/**
 * loads the population vs years graph for the industry if interest
 * @param prompt
 * @param src
 */
function loadGraph(prompt, src) {
    $("#graph-title").text(prompt);
    $("#graph").attr("src", src);
    $("#graph-container").show();
}

// Generate an SVG element on the page
var svg = d3.select('body').append('svg')
  .attr('width', svg_width - 50)
  .attr('height', svg_height)
  .attr('style', 'border:solid 3px #949494; padding: 30px 0; margin: 15px 0');//1849568

function getMousePosition(){
    return d3.mouse(this);
}

function showPopulationAndYear(population, year) {

}


d3.queue()
  .defer(d3.json, 'us.json')
  .defer(d3.csv, 'data/detroitpopn.csv')
  .defer(d3.csv, 'data/goldrush.csv')
    .defer(d3.csv, 'data/dakota.csv')
    .defer(d3.csv, 'data/sanfran.csv')
  .await(function(error, usa, detroit,SF,ndakota,valley) {

        if (error) console.error('error loading data: ' + error);
        else
        {

          d3.select('#industry-dropdown').on('change',function() {
              currentIdustry = this.value;
            var year = document.getElementById("year-dropdown").value;
            //console.log();
            switch(currentIdustry){
              case 'automotive' :
               drawCircle(detroitXY, detroit[0].Population, getPopnBound(detroit));
               loadGraph("Population of Detroit over the years", "data/detroit.png");
               updateYearSelect(detroit, 0);
               break;
                case 'mining' :
                    drawCircle(sanFranXY, SF[0].Population, getPopnBound(SF));
                    loadGraph("Population of California during the gold rush", "data/goldrush.png");
                    updateYearSelect(SF, 0);
                    break;
                case 'technology' :
                    drawCircle(sanFranXY, valley[0].Population, getPopnBound(valley));
                    loadGraph("Population of San Fransisco Bay Area", "data/tech.png");
                    updateYearSelect(valley, 0);
                    break;
              case 'oil' :
                drawCircle(nDakotaXY, ndakota[0].Population, getPopnBound(ndakota));
                  loadGraph("Population of North Dakota over the years", "data/dakota.png");
                updateYearSelect(ndakota, 0);
                break;
             }
          });

            d3.select('#year-dropdown').on('change',function() {
                //console.log();
                switch(currentIdustry){
                    case 'automotive' :
                        drawCircle(detroitXY, detroit[this.value].Population, getPopnBound(detroit));
                        updateYearSelect(detroit, this.value);
                        break;
                    case 'mining' :
                        drawCircle(sanFranXY, SF[this.value].Population, getPopnBound(SF));
                        updateYearSelect(SF, this.value);
                        break;
                    case 'technology' :
                        drawCircle(sanFranXY, valley[this.value].Population, getPopnBound(valley));
                        updateYearSelect(valley, this.value);
                        break;
                    case 'oil' :
                        drawCircle(nDakotaXY, ndakota[this.value].Population, getPopnBound(ndakota));
                        updateYearSelect(ndakota, this.value);
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
             .attr('fill','#1a1a1a')
             .attr('d', path)
             .attr('stroke', '#949494')
             .attr('stroke-width', 2);
        }
});
