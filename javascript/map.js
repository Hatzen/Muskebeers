import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { getColorForValue } from './colors'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

export default class Map {
  constructor(player) {
    this.player = player
    this.map    = L.map('map')
    this.initMap()
  }

  initMap() {
    const mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    const mapboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
    const grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution})
    const streets   = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution})

    const baseMaps = { grayscale, streets }
    this.layerController = L.control.layers(baseMaps, {}, { collapsed: false })

    this.layerController.addTo(this.map);
    streets.addTo(this.map)

    this.trackUserPosition()
  }

  trackUserPosition(map) {
    let onLocationFound = (e) => {
      this.player.setPosition(e.latlng, e.accuracy)
    }

    this.map.on('locationfound', onLocationFound);
    this.map.locate({setView: true, watch: true, maxZoom: 18});
  }

  initLayer(feature) {
    this.layer = L.layerGroup()
    this.layer.addTo(this.map)
    this.layerController.addOverlay(this.layer, feature.properties.question)
  }

  drawLine(position, color) {
    let currentPoint = L.latLng(position.lat, position.lng)
    L.polyline([this.lastPoint, currentPoint], { color })
      .addTo(this.layer)
  }

  initCircle(position) {
    let radius = position.accuracy / 2
    let coords = [position.lat, position.lng]
    this.circle = L.circle(coords, radius)
    this.circle.addTo(this.map)
  }

  updateCircle(position, color) {
    const latLng = L.latLng(position.lat, position.lng)
    let radius = position.accuracy / 2.0
    this.circle.setRadius(radius)
    this.circle.setStyle({ color })
    this.circle.setLatLng(latLng)
    if(this.layer)
      this.drawLine(position, color)
  }

  setPopup(elem) {
    this.circle.bindPopup(elem)
    this.circle.openPopup()
  }
}
