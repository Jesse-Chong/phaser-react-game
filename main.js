import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: 500,
  height: 500
}

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game")
  }

  preload(){
    this.load.image("bg", "/assets/bg.png")
  }
  create(){
    this.add.image(0, 0, "bg").setOrigin(0, 0)
  }
  update(){}
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas
}

const game = new Phaser.Game(config);