export default class Game {
  constructor(player) {
    this.player = player
  }

  async currentQuestion() {
    let response = await fetch('/active-question')
    let data = await response.json()

    if(data.status === "OK") return data.question
    this.getNewQuestion()
  }

  async getNewQuestion() {
    let loc = this.player.position
    if(!loc) return
    let url = `/question?position=${loc.lng}&position${loc.lat}&radius=5000000`
    let response = await fetch('/question')
    let data     = await response.json()

    if(data.status === "OK") return data.question
  }
}
