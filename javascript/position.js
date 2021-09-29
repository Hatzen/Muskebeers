import L from 'leaflet'

export default class Position {
  constructor(lat, lng, accuracy) {
    this.lat = lat
    this.lng = lng
    this.accuracy = accuracy
    this.latLng = L.latLng(lat, lng)
  }

  distanceTo(feature) {
    const [lng, lat] = feature.geometry.coordinates
    const questionPoint = L.latLng(lat, lng)
    return this.latLng.distanceTo(questionPoint)
  }
}
