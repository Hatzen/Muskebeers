import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet'
import { getColorForValue } from './colors'
import Popup from './Popup'
import Observable from './observable'
import Map from './map'

export default class Player extends Observable {
  constructor() {
    super()
    this.popUpElement = document.createElement('div')
    this.map = new Map(this)
    this.map.initCircle({ lat: 0, lng: 0, accuracy: 10.0 })

    ReactDOM.render(
      <Popup player={this} />,
      this.popUpElement
    );
  }

  setPosition(coords, accuracy) {
    let firstTimeCall = true
    if(this.position) {
      this.lastPoint = L.latLng(this.position.lat, this.position.lng)
      firstTimeCall = false
    }

    this.position = { ... coords, accuracy}
    this.color = this.calculateColor()
    this.map.updateCircle(this.position, this.color)

    if(firstTimeCall)
      this.emit('firstLocation')
    else
      this.emit('locationupdate')
  }

  setQuestion(feature) {
    this.feature = feature
    this.color = this.calculateColor()
    this.map.initLayer(feature)
    this.map.setPopup(this.popUpElement)
    this.emit('questionset', feature)
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
}
