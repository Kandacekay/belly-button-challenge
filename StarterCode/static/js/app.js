function getPlots(id) {
    // Read samples.json
    d3.json("samples.json").then(sampledata => {
        // Find the selected sample data based on the ID
        var selectedSample = sampledata.samples.find(sample => sample.id === id);
        var sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
        var OTU_top = selectedSample.otu_ids.slice(0, 10).reverse().map(d => "OTU " + d);
        var labels = selectedSample.otu_labels.slice(0, 10);

        // Create a color scale based on OTU IDs
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        var trace = {
            x: sampleValues,
            y: OTU_top,
            text: labels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: OTU_top.map(d => colorScale(d.replace("OTU ", ""))),
                opacity: 0.6
            }
        };

        // Create data variable for the bar chart
        var data = [trace];

        // Create layout variable to set plots layout
        var layout = {
            title: "<b>Top 10 OTU</b>",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // Create the bar plot
        Plotly.newPlot("bar", data, layout);

        var trace1 = {
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            mode: "markers",
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids.map(d => colorScale(d)),
                opacity: 0.7
            },
            text: selectedSample.otu_labels
        };

        // Set the layout for the bubble plot
        var layout_2 = {
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" },
            height: 600,
            width: 1000
        };

        // Create data variable for the bubble plot
        var data1 = [trace1];

        // Create the bubble plot
        Plotly.newPlot("bubble", data1, layout_2);
    });
}
    // create the function to get the necessary data
    function getDemoInfo(id) {
    // read the json file to get data
        d3.json("samples.json").then((data)=> {
    // get the metadata info for the demographic panel
            var metadata = data.metadata;
    
            console.log(metadata)
    
          // filter meta data info by id
           var result = metadata.filter(meta => meta.id.toString() === id)[0];
          // select demographic panel to put data
           var demographicInfo = d3.select("#sample-metadata");
            
         // empty the demographic info panel each time before getting new id info
           demographicInfo.html("");
    
         // grab the necessary demographic data data for the id and append the info to the panel
            Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
            });
            showGauge(result.wfreq);
        });
    }
    // create the function for the change event
    function optionChanged(id) {
        getPlots(id);
        getDemoInfo(id);
    }
    
    // create the function for the initial data rendering
    function init() {
        // select dropdown menu 
        var dropdown = d3.select("#selDataset");
    
        // read the data 
        d3.json("samples.json").then((data)=> {
            console.log(data)
    
            // get the id data to the dropdwown menu
            data.names.forEach(function(name) {
                dropdown.append("option").text(name).property("value", name);
            });
    
            // call the functions to display the data and the plots to the page
            getPlots(data.names[0]);
            getDemoInfo(data.names[0]);
        });
    };
  
    function showGauge(freq) {
        console.log("FRQ",freq);
        
        var traceGauge = {
            domain: { x: [0, 1], y: [0, 1] },
            value: freq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per-Week</br>" },
            type: "indicator",
            mode: "gauge+number",
            delta: {reference: 400},
            gauge: {
              axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
              bar: { color: "rgba(255, 255, 3, 0.63)" },
              shape: {
                type: 'path',
                path: 'M 0.5 0.2 L 0.5 0.9 L 0.6 0.9 Z',
                fillcolor: 'red'
              },
              steps: [
                { range: [0, 1], color: "rgba(188, 191, 255, 0.8)" },
                { range: [1, 2], color: "rgba(188, 112, 255, 0.8)" },
                { range: [2, 3], color: "rgba(188, 37, 255, 0.8)" },
                { range: [3, 4], color: "rgba(76, 124, 255, 0.8)" },
                { range: [4, 5], color: "rgba(0, 58, 255, 0.8)" },
                { range: [5, 6], color: "rgba(11, 243, 11, 0.8)" },
                { range: [6, 7], color: "rgba(247, 255, 0, 0.8)" },
                { range: [7, 8], color: "rgba(255, 124, 19, 0.8)" },
                { range: [8, 9], color: "rgba(250, 38, 0, 0.8)" }
              ]
            }
          };
          
          var layoutGauge = { width: 600, height: 500, margin: { t: 0, b: 0 } };
          
          Plotly.newPlot("gauge", [traceGauge], layoutGauge);
    
      }
    
    init();