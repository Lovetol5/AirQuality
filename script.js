// Example coordinates for testing purposes.
const locations = [
    { name: 'City A', coords: [34.0522, -118.2437], population: 10000 }, // Los Angeles
    { name: 'City B', coords: [40.7128, -74.0060], population: 80000 },  // New York
    { name: 'City C', coords: [51.5074, -0.1278], population: 90000 }    // London
];

// Initializing the map
const map = L.map('map').setView([20, 0], 2); 

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Add markers for each location
locations.forEach(location => {
    L.marker(location.coords).addTo(map)
        .bindPopup(`${location.name}<br>Population: ${location.population}`);
});

// Fetch Air Quality Data (using a placeholder URL)... unsure why NO AQI information is being displayed.
async function fetchAirQualityData() {
    const responses = await Promise.all(locations.map(location =>
        fetch(`https://api.airnowapi.org/aq/data/?location=${location.name}&apiKey=e6772d9541244af833302bb5efa5ad1b`)
    ));
    const data = await Promise.all(responses.map(res => res.json()));
    return data;
}

// Plot data
async function plotData() {
    const airQualityData = await fetchAirQualityData();
    
    const trace1 = {
        x: locations.map(loc => loc.name),
        y: airQualityData.map(data => data[0].AQI), // Assuming the first data point is needed
        type: 'bar',
        name: 'AQI'
    };

    const trace2 = {
        x: locations.map(loc => loc.name),
        y: locations.map(loc => loc.population),
        type: 'bar',
        name: 'Population',
        yaxis: 'y2'
    };

    const layout = {
        title: 'Air Quality Index and Population Comparison',
        yaxis: { title: 'AQI' },
        yaxis2: {
            title: 'Population',
            overlaying: 'y',
            side: 'right'
        },
        barmode: 'group'
    };

    Plotly.newPlot('chart', [trace1, trace2], layout);
}

// Call the plotting function
plotData();
