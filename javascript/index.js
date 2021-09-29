import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

import Game from './game'
import Player from './player'
import Navigation from './components/Navigation'

let player = new Player()
let game   = new Game(player)

ReactDOM.render(
  <Navigation />,
  document.getElementById('app')
);
