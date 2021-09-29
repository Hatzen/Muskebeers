import { newQuestion, checkpointReached } from './requests'

export default class Game {
  constructor(player) {
    this.player = player
    this.player.on('firstLocation', this.start.bind(this))
    this.player.on('locationupdate', this.update.bind(this))
    //this.player.on('fuckingclose', this.nextQuestion.bind(this))
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

  async nextQuestion() {
    const score = await checkpointReached()
    const feature = await newQuestion(this.player.position)

    if(feature) {
      this.player.setQuestion(feature)
      this.player.updateCircle()
      this.player.setPopupQuestion()
    } else {
      alert("No more questions, you have reached the end")
    }
  }
}
