// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 4
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Declare url variable
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Read url response
d3.json(url, function (response) {
    console.log(response);

    // Loop through specific url response needed
    for (var index = 0; index < response.features.length; index++) {

        // Declare variables needed to complete assignment
        var coordinates = response.features[index].geometry.coordinates;
        var depth = response.features[index].geometry.coordinates[2];
        // console.log(depth);
        var magnitude = response.features[index].properties.mag;
        // console.log(magnitude);

        var approxPlace = response.features[index].properties.place;
        // console.log(place);

        // Source: Epoch Date Converter https://www.epochconverter.com/programming/
        // Source: Epoch Year Correction https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
        // Obtain time of earthquake to display on Popup
        var approxTime = new Date(response.features[index].properties.time);
        // console.log(approxTime);

        // Color to be based on value of depth
        // Source: Activity 1-7 - Stu_Country_World_Cup

        var color = "";
        if (depth > 90) {
            color = "black";
        }
        else if (depth > 70) {
            color = "blue";
        }
        else if (depth > 50) {
            color = "purple";
        }
        else if (depth > 30) {
            color = "green";
        }
        else if (depth > 10) {
            color = "orange";
        }
        else {
            color = "yellow";
        }

        // Source: Activity 2-2 Ins_Markers
        // Checks for coordinates property
        if (coordinates) {
            // Create circle markers along with Popup Values
            L.circle([coordinates[1], coordinates[0]], {
                color: "white",
                fillColor: color,
                fillOpacity: 1,
                radius: magnitude * 19000
            }).bindPopup(`<h3>${approxPlace}` + `<h3>${approxTime}` + `<h3>Magnitude: ${magnitude}` + `<h3>Depth: ${depth}`).addTo(myMap);
        }
    }

    // Add legend
    // Source:  https://github.com/timwis/leaflet-choropleth/blob/gh-pages/examples/legend/demo.js
    // Source:  https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');
        var labels = ["Earthquake Depth (km)"];
        var categories = ['< 10', '10 - 30', '30 - 50', '50 - 70', '70 - 90', '90+'];
        var colors = ["yellow", "orange", "green", "purple", "blue", "black"];

        for (var i = 0; i < categories.length; i++) {

            div.innerHTML =
                labels.push(
                    '<li style="background-color:' + colors[i] + '   "></li>   ' + categories[i]);

        }
        div.innerHTML = '<ul>' + labels.join('   ') + '</ul>'
        return div;
    };
    legend.addTo(myMap);
})