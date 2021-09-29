import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet'
import { getColorForValue } from './colors'
import Popup from './Popup'
import Observable from './observable'
import Map from './map'
import Position from './position'

export default class Player extends Observable {
  constructor() {
    super()
    this.popUpElement = document.createElement('div')
    this.map = new Map(this)
    this.map.initCircle({ lat: 0, lng: 0, accuracy: 10.0 })
    this.map.initPopup(this.popUpElement)

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

    this.position = new Position(coords.lat, coords.lng, accuracy)

    if(this.feature) {
      this.calculateParams()
      if(this.distance < this.feature.properties.buffer)
        this.emit('fuckingclose', this.feature)
    } else {
      this.color = 'green'
    }

    this.map.updateCircle(this.position, this.color)

    if(firstTimeCall)
      this.emit('firstLocation')
    else
      this.emit('locationupdate', this)
  }

  setQuestion(feature) {
    this.feature = feature
    this.calculateParams()
    this.map.updateCircle(this.position, this.color)
    this.map.initLayer(feature, this.position)
    this.map.openPopup()
    this.emit('questionset', feature)
  }

  calculateParams() {
    this.distance = this.position.distanceTo(this.feature)
    this.color = getColorForValue(this.distance / 1000.0)
  }
}
