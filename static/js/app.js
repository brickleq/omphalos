function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // if (error) throw error;
  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
  // console.log(url); 
  d3.json(url).then(function(sample) {
    var sampleMetadata = sample;
    console.log(sampleMetadata);
        // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (let [key, value] of Object.entries(sampleMetadata)) {
      selector.append("li")
      .text(`${key}: ${value}`)
      .property("key", key)
      .property("value", value);
    }
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
var url = "/samples/" + sample;
var sampleName = sample;
d3.json(url).then(function(sample) {
  var sampleData = sample;
  console.log(data);

  // * Create a Bubble Chart that uses data from your samples route (`/samples/<sample>`) to display each sample.

//   * Use `otu_ids` for the x values

//   * Use `sample_values` for the y values

//   * Use `sample_values` for the marker size

//   * Use `otu_ids` for the marker colors

//   * Use `otu_labels` for the text values
  var normalized_otu_ids = normalize_array(sampleData.otu_ids);
  var selector = d3.select("#bubble");
  selector.html("");
  var trace = {
    x: sampleData.otu_ids,
    y: sampleData.sample_values,
    mode: "markers",
    marker: {
      size: sampleData.sample_values,
      colorscale: "Earth",
      color: normalized_otu_ids,
      symbol: "circle"
    },
    text: sampleData.otu_labels,
    type: "scatter"
  };
  console.log(sampleData.otu_ids);
  console.log(normalized_otu_ids);
  var data = [trace];
  console.log(data);
  var layout = {
    title: `Bubble Chart - Sample ${sampleName}`,
    showlegend: false,
    height: 600,
    width: 600
  };
  var myDiv = document.getElementById("bubble");
  console.log([trace]);
  Plotly.newPlot(myDiv, data, layout);

})

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

function normalize_array(arr) {
// Normalize array values on scale of 0 to 1 (for color scale)
  normalize = function(val, max, min) { 
    return(val - min) / (max - min); 
  }
  max = Math.max.apply(null, arr) 
  min = Math.min.apply(null, arr)
  hold_normed_values=[]
  arr.forEach(function(this_num) {
    hold_normed_values.push(normalize(this_num, max, min))
  })
  return(hold_normed_values)
}

function event_listener() {
  var selector = d3.select("#selDataselect");
  selector.addEventListener("change",optionChanged);
}
// Initialize the dashboard
init();
event_listener();
