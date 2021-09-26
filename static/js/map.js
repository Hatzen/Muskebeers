var map = L.map('map').setView([51.96271170597515, 7.628752552956029], 15);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/light-v9',
  tileSize: 512,
  zoomOffset: -1
}).addTo(map);

function onEachFeature(feature, layer) {
  var popupContent = ""

  if (feature.properties) {
    for(key in feature.properties) {
      popupContent += `<b>${key}</b> ${feature.properties[key]}<br>`
    }
  }

  layer.bindPopup(popupContent);
}

var stimmbezirke = fetch('/static/data/questions.geojson')
  .then(response => response.json())
  .then((stimmbezirke) => { 

    L.geoJSON(stimmbezirke, {

      style: function (feature) {
        return feature.properties && feature.properties.style;
      },

      onEachFeature: onEachFeature,

      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    }).addTo(map);
  })
