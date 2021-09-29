import React from 'react'
import { leaveGame } from '../requests'

async function logout(e) {
  e.preventDefault()
  let logout = await leaveGame()
  window.location.reload()
}

export default function Navigation() {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src="/static/images/logo.png" alt="" width="30" height="24" />
        </a>
        <form className="d-flex">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/" onClick={logout}>Logout</a>
            </li>
          </ul>
        </form>
      </div>
    </nav>
  )
}
