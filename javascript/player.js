import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet'
import { getColorForValue } from './colors'
import Popup from './Popup'

export default class Player {
  constructor() {
    this.events = {}
    this.popUpElement = document.createElement('div')

    ReactDOM.render(
      <Popup player={this} />,
      this.popUpElement
    );
  }

  setMap(map) {
    this.map = map
  }

  on(key, method) {
    this.events[key] = method
  }

  emit(key, payload) {
    if(this.events[key])
      this.events[key](payload)
  }

  setPosition(coords, accuracy) {
    let firstTimeCall = true
    if(this.position) {
      this.lastPoint = L.latLng(this.position.lat, this.position.lng)
      firstTimeCall = false
    }

    this.position = { ... coords, accuracy}
    this.color = this.calculateColor()

    if(firstTimeCall)
      this.emit('firstLocation')
    else
      this.emit('locationupdate')
  }

  setQuestion(feature) {
    this.feature = feature
    this.color = this.calculateColor()
    this.circle.setStyle({ color: this.color })
    this.emit('questionset', feature)
  }

  initCircle() {
    let radius = this.position.accuracy / 2
    let coords = [this.position.lat, this.position.lng]
    this.circle = L.circle(coords, radius)
    this.circle.addTo(this.map)
  }

  setPopupQuestion() {
    this.circle.bindPopup(this.popUpElement)
    this.circle.openPopup()
  }

  calculateColor() {
    if(!this.feature) return 'green'
    let currentPoint = L.latLng(this.position.lat, this.position.lng)
    let questionPoint = L.latLng(this.feature.geometry.coordinates.reverse())
    this.feature.geometry.coordinates.reverse()
    let distanceKm = currentPoint.distanceTo(questionPoint) / 1000.0
    return getColorForValue(distanceKm)
  }

  updateCircle() {
    let radius = this.position.accuracy / 2.0
    this.circle.setRadius(radius)
    this.circle.setStyle({ color: this.color })
    this.circle.openPopup()
  }

  drawLine() {
    let currentPoint = L.latLng(this.position.lat, this.position.lng)
    L.polyline([this.lastPoint, currentPoint], { color: this.color })
      .addTo(this.map)
  }
}
