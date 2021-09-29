async function currentQuestion() {
  let response = await fetch('/active-question')
  let data = await response.json()

  if(data.status === "OK") 
    return data.feature
}

async function newQuestion(loc) {
  let url = `/question?position=${loc.lng}&position=${loc.lat}&radius=5000`
  let response = await fetch(url)
  let data     = await response.json()

  if(data.status === "OK") return data.feature
}

async function skipQuestion(loc) {
  let url = `/skip-question?position=${loc.lng}&position=${loc.lat}&radius=5000`
  let response = await fetch(url)
  let data     = await response.json()

  if(data.status === "OK") return data.feature
}

async function checkpointReached() {
  let response = await fetch('/checkpoint-reached', { method: 'POST' })
  let data     = await response.json()

  if(data.status === "OK") return data.score
}

async function requestCurrentScore() {
  let response = await fetch('/get-score')
  let data     = await response.json()

  if(data.status === "OK") return data.question
}

async function leaveGame() {
  let response = await fetch('/leave-game', { method: 'POST' })
  let data     = await response.json()

  return data.status === "OK"
}

export { 
  currentQuestion, 
  newQuestion, 
  skipQuestion, 
  checkpointReached, 
  requestCurrentScore,
  leaveGame
}
