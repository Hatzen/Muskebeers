import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

import { getColorForValue } from './colors'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

function trackUserPosition(map, player) {
  let onLocationFound = (e) => {
    player.setPosition(e.latlng, e.accuracy)
  }

  map.on('locationfound', onLocationFound);
  map.locate({setView: true, watch: true, maxZoom: 18});
}

export default function Map(player) {
  const mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  const mapboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  const grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution})
  const streets   = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution})
  const map = L.map('map')

  const baseMaps = { grayscale, streets }
  const layerController = L.control.layers(baseMaps, {}, { collapsed: false })

  layerController.addTo(map);
  streets.addTo(map)

  player.setMap(map, layerController)
  trackUserPosition(map, player)
}
