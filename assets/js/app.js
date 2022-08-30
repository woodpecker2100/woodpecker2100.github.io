// Setting up variables for creating the SVG 

var svgWidth = 950;
var svgHeight = 600;
var margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;


// Adding the div classed chart to the scatter element - and then the svg to the chart
var chart = d3.select("#scatter")
    .append("div")
    .classed("chart", true);

    var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// X and Y axis
var xAxis = "poverty";
var yAxis = "healthcare";

// Creating scales for x and y axis with min/max values and minus/plus 10 percent
function xScale(healthData, xAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[xAxis]) * 0.9, d3.max(healthData, d => d[xAxis]) * 1.1])
        .range([0, width]);
    return xLinearScale;
}

//function used for updating y-scale var upon clicking on axis label
function yScale(healthData, yAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[yAxis]) * 0.9, d3.max(healthData, d => d[yAxis]) * 1.1])
        .range([height, 0]);
    return yLinearScale;
}

// Retrieve csv data and create chart
d3.csv("./assets/data/data.csv").then(function(healthData) {
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // Create linear scales
    var xLinearScale = xScale(healthData, xAxis);
    var yLinearScale = yScale(healthData, yAxis);


    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    
    // Append x and y axis
    var x_Axis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var y_Axis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // X axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .classed("aText", true)
        .attr("data-axis-name", "healthcare")
        .text("Lacks Healthcare(%)");

    // Y axis labels
    chartGroup.append("text")
        .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
        .attr("data-axis-name", "poverty")
        .classed("aText", true)
        .text("In Poverty (%)");

    // Append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[xAxis]))
        .attr("cy", d => yLinearScale(d[yAxis]))
        .attr("r", 10)
        .attr("opacity", ".85");

    // Append the text to the circles
    var textGroup = chartGroup.selectAll(".stateText")
        .data(healthData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[xAxis]))
        .attr("y", d => yLinearScale(d[yAxis]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});

    
 });




