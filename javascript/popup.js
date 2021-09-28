import '@fortawesome/fontawesome-free/css/all.css'
function skip() {
  alert("ok :(")
}

function qr() {
  alert("yey! :)")
}

window.skip = skip
window.qr = qr

export default function Popup({ question, hints }) {
  return `<div>
      <b>${question}</b>
      <p>${hints.join(',')}</p>
      <hr/>
      <button onClick="qr()" class="btn btn-sm btn-secondary">
      <i class="fas fa-qrcode"></i>
      </button>
      <button onClick="skip()" class="btn btn-sm btn-danger">
      <i class="fas fa-forward"></i>
      </button>
    </div>`
}
