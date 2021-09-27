export default class Player {
  constructor() { }
  setPosition(latlng, accuracy) {
    this.position = {
      lat: latlng[0],
      lng: latlng[1],
      accuracy: accuracy
    }
  }
}
