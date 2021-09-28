import '@fortawesome/fontawesome-free/css/all.css'
import React from 'react'
function skip() {
  alert("ok :(")
}

function qr() {
  alert("yey! :)")
}

export default function Popup({ question }) {
  return (
    <div>
      <b>{question}</b>
      <hr/>
      <div className="row">
        <button onClick={qr} class="btn btn-sm btn-secondary">
        <i className="fas fa-qrcode"></i>
        </button>
        <button onClick={skip} class="btn btn-sm btn-danger">
        <i className="fas fa-forward"></i>
        </button>
      </div>
    </div>
  )
}
