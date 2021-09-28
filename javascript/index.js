import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

import Map from './map'
import Game from './game'
import Player from './player'

let player = new Player()
let game   = new Game(player)

Map(player)

import React from 'react';
import ReactDOM from 'react-dom';
 
const title = 'React with Webpack and Babel';
 
ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('app')
);
