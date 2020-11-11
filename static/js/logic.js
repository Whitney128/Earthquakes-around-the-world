// Store API link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//setting marker sizes for magnitudes
function markerSize(mag) {
  return mag * 30000;
}

//setting different colors for magnitudes
function markerColor(mag) {
  if (mag <= 1) {
      return "  #00FF00";
  } else if (mag <= 2) {
      return "#FF00FF";
  } else if (mag <= 3) {
      return "#FFFF00";
  } else if (mag <= 4) {
      return "#0000FF";
  } else if (mag <= 5) {
      return "#00FFFF";
  } else {
      return "#FF0000";
  };
}

//adding data link
d3.json(link, function(data) {
  createFeatures(data.features);
});


//creating function for features
function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {

 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
  }
  });

  createMap(earthquakes);
}

//creating layers for map
function createMap(earthquakes) {

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token="+ API_KEY );
  
  var baseMaps = {
    "Outdoors": outdoors,
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [36.7783, 119.4179],
    zoom: 3,
    layers: [outdoors, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  const labels = [' #00FF00', '#FF00FF', '#FFFF00', '#0000FF', '#00FFFF', '#FF0000']

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [-10, 10, 30, 50, 70, 90];

           for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + labels[i] + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' &dash; ' + magnitudes[i + 1] + '<br>' : ' + ');
      }

  console.log(markerColor(1))
      return div;
  };
  
  legend.addTo(myMap);

}
