import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

import Map from './map'
import Game from './game'
import Player from './player'

let player = new Player()
let game   = new Game(player)

Map(player)
