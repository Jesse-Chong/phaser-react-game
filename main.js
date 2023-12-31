import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: 500,
  height: 500
}

// initialize a varialbe with downwards speed for physics system
const speedDown = 500

const gameStartDiv = document.querySelector("#gameStartDiv")
const gameStartBtn = document.querySelector("#gameStartBtn")
const gameEndDiv = document.querySelector("#gameEndDiv")
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan")
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan")


class GameScene extends Phaser.Scene{
// super() is called to initialize parent Phaser.Scene clas (required)
// scene-game is a string to identify the scene
  constructor(){
    super("scene-game")
    // store references to the sprites we create later
    this.player
    this.cursor
    this.playerSpeed=speedDown+200
    this.target
    this.points = 0
    this.textScore
    this.textTime
    this.timedEvent
    this.remainingTime
    this.coinMusic
    this.bgMusic
    this.emitter
  }

  // load assets    ((key/class),(path to image))
  preload(){
    this.load.image("bg", "/assets/bg.png")
    this.load.image("basket", "/assets/basket.png")
    this.load.image("apple", "/assets/apple.png")
    this.load.image("money", "/assets/money.png")
    this.load.audio("coin", "/assets/coin.mp3")
    this.load.audio("bgMusic", "/assets/bgMusic.mp3")
  }

  // create actual sprite objects from loaded assets
  create(){
    this.scene.pause("scene-game")
    this.coinMusic = this.sound.add("coin")
    this.bgMusic = this.sound.add("bgMusic")
    this.bgMusic.play()
    // add a static image sprite
    this.add.image(0, 0, "bg").setOrigin(0, 0)
    // this is the "player" and create a physics-enabled image sprite
    this.player = this.physics.add.image(0, sizes.height - 100, "basket").setOrigin(0, 0)
    // prevent player sprite from being moved by collisions or forces
    this.player.setImmovable(true)
    // stop gravity from applying to the player body
    this.player.body.allowGravity = false
    // prevent player from going off screen with an invisible wall
    this.player.setCollideWorldBounds(true);
    // relize collision box and shifts offset to better fit basket shape
    this.player.setSize(this.player.width-this.player.width/4, this.player.height/6).
    setOffset(this.player.width/10, this.player.height - this.player.height/10)
    // set max vertical velocity the apple can fall downwards
    this.target = this.physics.add
    .image(0, 0, "apple")
    .setOrigin(0, 0)
    this.target.setMaxVelocity(0, speedDown + 200);
    // checks for collision between apple and basket
    this.physics.add.overlap(this.target,this.player,this.targetHit, null, this)
    // create cursor keys for controlling basket input
    this.cursor=this.input.keyboard.createCursorKeys();
    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "black"
    })
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "black"
    })
    this.timedEvent = this.time.delayedCall(15000,this.gameOver, [], this)
    this.emitter=this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: speedDown-200,
      scale: 0.04,
      duration: 100,
      emitting: false
    })
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
  }

  // this runs in game loop
  update(){
    this.remainingTime=this.timedEvent.getRemainingSeconds()
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX())
    }
      const {left, right} = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

// helper function to get random position
  getRandomX() {
    return Math.floor(Math.random() * 400);
  }

  // called on collision
  // when apple hits basket reset to top on y axis
  // then randomize position on x axis
  // then increment the player score
  targetHit() {
    this.coinMusic.play()
    this.emitter.start()
    this.target.setY(0);
    this.target.setX(this.getRandomX())
    this.points++;
    this.textScore.setText(`Score: ${this.points}`)
  }
  
  gameOver() {
    this.sys.game.destroy(true)
    if(this.points >= 10) {
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "Win! 👍"
    } else {
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "Lose! 😓"
    }
    gameEndDiv.style.display="flex"
  }
}


const config = {
  // WEBGL is a renderer for better performance
  type: Phaser.WEBGL,
  // dimensions of game screen
  width: sizes.width,
  height: sizes.height,
  // DOM element to render canvas to
  canvas: gameCanvas,
  // configure built-in physics
  physics:{
    default: "arcade",
    arcade: {
      gravity: {y:speedDown},
      debug: true
    }
  },
  // register scenes to use
  scene:[GameScene]
}

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", ()=>{
  gameStartDiv.style.display="none"
  game.scene.resume("scene-game")
})