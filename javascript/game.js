import { newQuestion } from './requests'

export default class Game {
  constructor(player) {
    this.player = player
    this.player.on('firstLocation', this.start.bind(this))
    this.player.on('locationupdate', this.update.bind(this))
  }

  async start() {
    let feature = await newQuestion(this.player.position)
    this.player.initCircle()
    if(feature) {
      this.player.setQuestion(feature)
      this.player.updateCircle()
      this.player.setPopupQuestion()
    }
  }

  update() {
    this.player.updateCircle()
    this.player.drawLine()
  }
}
