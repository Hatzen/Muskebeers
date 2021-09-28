import '@fortawesome/fontawesome-free/css/all.css'
import React, { useState } from 'react'
import { skipQuestion } from './requests'

function skip(player) {
  return async () => {
    let feature = await skipQuestion(player.position)
    player.setQuestion(feature)
  }
}

function qr() {
  alert("yey! :)")
}

export default function Popup({ player }) {
  const [question, setQuestion] = useState('')
  const [hints, setHints] = useState([])

  player.on('questionset', (feature) => {
    setQuestion(feature.properties.question)
    setHints(feature.properties.hints)
  })

  return (
    <div>
      <b>{question}</b>
      <p>{hints.map((h) => <Pill hint={h} />)}</p>
      <hr/>
      <div className="row">
        <button onClick={qr} className="btn btn-sm btn-secondary">
        <i className="fas fa-qrcode"></i>
        </button>
        <button onClick={skip(player)} className="btn btn-sm btn-danger">
        <i className="fas fa-forward"></i>
        </button>
      </div>
    </div>
  )
}

function Pill({ hint }) {
  return <span className="badge bg-primary">{hint}</span>
}
