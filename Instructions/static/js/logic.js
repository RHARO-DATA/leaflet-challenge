
// API
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Map Object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add title layer
var streetmap =new L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 16,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var vColor = "";

// Function to generate the PopUp Earthquake information
function forEachFeature(feature, layer) {

  var popupContent = `<h3>Place: ${feature.properties.place} </h3> <hr> <p>Time: ${Date(feature.properties.time)} </p> <hr> <p>Magnitude: ${feature.properties.mag} </p>`;
   
  layer.bindPopup(popupContent);
};

// Function to generate Cirlcle mapping of earthquakes on map
function findColor(mag) {
  
  if (mag > 4.5){
    vColor = "#b30000";
  }
  else if (mag > 3.5){
    vColor = "#e34a33";
  }
  else if (mag > 2.5){
    vColor = "#fc8d59";
  }
  else {
    vColor = "#fdcC8a";
  };
  return vColor;
};

// Setting the Cirlcle information
var earthquake = L.geoJSON(null, {
  onEachFeature: forEachFeature, 
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {'radius': feature.properties.mag * 3,  
                                    'opacity': .5,
                                    'color': "white",
                                    'fillColor': findColor(feature.properties.mag), 
                                    'fillOpacity': 0.75});
  }
});

//get request from query
d3.json(queryUrl, function(data) {                        
  earthquake.addData(data);                              
});


earthquake.addTo(myMap);

//  Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2.5, 3.5, 4.5],
        labels = ["#fdcC8a", "#fc8d59", "#e34a33", "#b30000"];
        
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + findColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
    
    console.log(div);
    return div;
};

legend.addTo(myMap);