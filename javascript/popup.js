import '@fortawesome/fontawesome-free/css/all.css'
import React, { useState, useEffect } from 'react'
import { currentQuestion } from './requests'

function skip() {
  alert("ok :(")
}

function qr() {
  alert("yey! :)")
}

export default function Popup() {
  const [question, setQuestion] = useState('')

  useEffect(async () => {
    const feature = await currentQuestion()
    setQuestion(feature.properties.question)
  })

  return (
    <div>
      <b>{question}</b>
      <hr/>
      <div className="row">
        <button onClick={qr} className="btn btn-sm btn-secondary">
        <i className="fas fa-qrcode"></i>
        </button>
        <button onClick={skip} className="btn btn-sm btn-danger">
        <i className="fas fa-forward"></i>
        </button>
      </div>
    </div>
  )
}
