import { newQuestion, checkpointReached } from './requests'

export default class Game {
  constructor(player) {
    this.player = player
    this.player.on('firstLocation', this.start.bind(this))
  }

  async start() {
    let feature = await newQuestion(this.player.position)
    if(feature) {
      this.player.setQuestion(feature)
    }
  }

  async nextQuestion() {
    const score = await checkpointReached()
    const feature = await newQuestion(this.player.position)

    if(feature) {
      this.player.setQuestion(feature)
    } else {
      alert("No more questions, you have reached the end")
    }
  }
}
