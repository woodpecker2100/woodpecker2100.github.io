// Variable declarations 

var samples = 'samples.json'

 // Function for the index.html's optionChanged action
 function optionChanged(newSample) {
    plotting(newSample);
    demography(newSample);
};

// Dataset into dropdown
function dropdown_init() {
    var dropdown = d3.select("#selDataset")
    d3.json(samples).then(function (data) {
        var id = data.names;
        
        id.forEach(name => dropdown
            .append("option")
            .text(name)
            .property('value', name))

            console.log(data);

        console.log(id[0]);
        demography(id[0]); //population the demography panel with the first item (940)
        plotting(id[0]); //plotting the first item (940)
    });
};

// Populating demography panel
function demography(unique_id) {
    var panels = d3.select("#sample-metadata")
    panels.html("")
    d3.json(samples).then(function (data) {
        var info = data.metadata;
        info = info.filter(row => row.id == unique_id)[0];
        Object.entries(info).forEach(function ([key, value]) {
            panels.append("p").text(`${key}: ${value}`)
            console.log(`${key}: ${value}`)
        });
    });
};

// Horizontal bar chart and bubble chart generation
function plotting(unique_id) {
    d3.json(samples).then(function (data) {
        var samples = data.samples;
        var resultsArray = samples.filter(sampleObj => sampleObj.id == unique_id);
        var results = resultsArray[0];
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        // Building the horizontal bar chart
        var bar_trace = {
            type: 'bar',
            orientation: 'h',
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            text: otu_labels.slice(0, 10).reverse(),
        };
        var bar_data = [bar_trace];
        var bar_title = {
            title: "Top 10 OTU values for the selected individual",
        };

        // Plotting horizontal chart
        Plotly.newPlot("bar", bar_data, bar_title);

        // Build the bubble chart
        var bubble_trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        };
        var bubble_data = [bubble_trace];
        var bubble_details = {
            title: "Bacteria Cultures Per Sample",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Frequency"}
        };

        // Plotting the bubble chart
        Plotly.newPlot("bubble", bubble_data, bubble_details)
    });
}

dropdown_init();

