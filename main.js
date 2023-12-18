import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: 500,
  height: 500
}

const speedDown = 300

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game")
    this.player
    this.cursor
    this.playerSpeed=speedDown+50
  }

  preload(){
    this.load.image("bg", "/assets/bg.png")
    this.load.image("basket", "/assets/basket.png")
  }
  create(){
    this.add.image(0, 0, "bg").setOrigin(0, 0)
    this.player = this.physics.add.image(0, sizes.height - 100, "basket").setOrigin(0, 0)
    // prevent basket from being affected by gravity (physics) ^^
    this.player.setImmovable(true)
    this.player.body.allowGravity = false

    this.cursor=this.input.keyboard.createCursorKeys()
  }
  update(){
        const {left, right} = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics:{
    default: "arcade",
    arcade: {
      gravity: {y:speedDown},
      debug: true
    }
  },
  scene:[GameScene]
}

const game = new Phaser.Game(config);