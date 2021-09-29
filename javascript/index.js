import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

import Map from './map'
import Game from './game'
import Player from './player'
import Navigation from './components/Navigation'

let player = new Player()
let game   = new Game(player)

Map(player)
 
const title = 'React with Webpack and Babel';
 
ReactDOM.render(
  <Navigation />,
  document.getElementById('app')
);
