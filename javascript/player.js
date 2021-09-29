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

  setMap(map, controlls) {
    this.map = map
    this.controlls = controlls
  }

  on(key, method) {
    this.events[key] = method
  }

  emit(key, payload) {
    if(this.events[key])
      this.events[key](payload)
  }

  initLayer() {
    this.layer = L.layerGroup()
    this.layer.addTo(this.map)
    this.controlls.addOverlay(this.layer, this.feature.properties.question)
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
    this.initLayer()
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
    const distanceKm = this.distanceToAnswer()
    return getColorForValue(distanceKm)
  }

  distanceToAnswer() {
    const currentPoint = L.latLng(this.position.lat, this.position.lng)
    const questionPoint = L.latLng(this.feature.geometry.coordinates.reverse())
    this.feature.geometry.coordinates.reverse()
    const distance = currentPoint.distanceTo(questionPoint)
    this.emit('distanceUpdated', distance)
    if(distance <= this.feature.properties.buffer)
      this.emit('fuckingclose', this.feature)
    return distance / 1000.0
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
      .addTo(this.layer)
  }
}
