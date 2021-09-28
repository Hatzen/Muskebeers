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
  let response = await fetch('/checkpoint-reached')
  let data     = await response.json()

  if(data.status === "OK") return data.question
}

async function requestCurrentScore() {
  let response = await fetch('/get-score')
  let data     = await response.json()

  if(data.status === "OK") return data.question
}

export { 
  currentQuestion, 
  newQuestion, 
  skipQuestion, 
  checkpointReached, 
  requestCurrentScore 
}
