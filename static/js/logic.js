
//identify the data set and where it is coming from
var api_earthq = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//create a function that will get the size of the marker based on magnitude

function markerSize(magnitude) {
    return magnitude * 5;
};
//create layer to hold the view of the earthquake markers

var earthquakes = new L.LayerGroup();

//load the data using d3 and use pointtolayer

d3.json(api_earthq, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {  
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },
//adds a comment for each popup
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

//have the colours change based on the magnitude

function Color(mag) {
    if (mag > 5) {
        return 'red'
    } else if (mag > 4) {
        return 'orange'
    } else if (mag > 3) {
        return 'tan'
    } else if (mag > 2) {
        return 'yellow'
    } else if (mag > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};


//create map function to add layers to map (CURRENTLY WORKING)
function createMap() {

   var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
    });

 	var mymap = L.map('map', {
        center: [40, -99],
        zoom: 4.3,
  
        layers: [satellite, earthquakes]
    });


    var baseLayers = {
        "Street": streetMap,
        "Satellite": satellite
    };

    var overlays = {
        "Earthquakes": earthquakes,
        
    };
//add the layers to mymap
    L.control.layers(baseLayers, overlays).addTo(mymap);

//add a legend to the map
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);
}



//use this to deploy the map  
createMap();