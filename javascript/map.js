import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

import { getColorForValue } from './colors'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

function setTileLayer(map) {
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(map);
}

let circle = L.circle([0, 0], 0)
let lastPoint = []

function trackUserPosition(map, player) {
  let onLocationFound = (e) => {
    var radius = e.accuracy / 2;
    let color  = getColorForValue(0.1)

    circle.setLatLng(e.latlng)
    circle.setRadius(radius)
    circle.setStyle({ color })

    player.setPosition(e.latlng, e.accuracy)

    L.polyline([lastPoint, e.latlng], { color }).addTo(map)
    lastPoint = e.latlng
  }

  map.on('locationfound', onLocationFound);
  map.locate({setView: true, watch: true, maxZoom: 16});
}

export default function Map(player) {
  let map = L.map('map');

  circle.addTo(map);
  setTileLayer(map)
  trackUserPosition(map, player)
}
