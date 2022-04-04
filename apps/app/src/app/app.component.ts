import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js'
import { htmlaudio, Sound, sound, SoundLibrary } from '@pixi/sound'
import { DisplayObject, Sprite, Texture } from "pixi.js";

// Step2
// ToDo: Animate Object

const sounds = [
  sound.add('woop', '../assets/sound/build1soundTest_01.mp3'),
  sound.add('toaster-start', '../assets/sound/toaster-start(short)_01.mp3')
]

const images = [
  { name: "background", url: "../assets/backgrounds/CuisineV1.jpg" },
  { name: "Waldo", url: "../assets/catanimation/Animation-Waldo.gif" },
  { name: "toasterIdle", url: "../assets/things/toaster/idle/grille_pain.png" }
]

const catWalkingFrames = [
  Texture.from("../assets/catanimation/Walk1.png"),
  Texture.from("../assets/catanimation/Walk2.png")
];

//Global variables
let app: PIXI.Application;
let stage: PIXI.Container;
let elapsedTime = 0.0;
//Cat-stuff
let cat: PIXI.Container;
let catAnimationSpeed = 0.05;
let catStartPositionX = 800;
let catStartPositionY = 600;
let catMaxWalkLimitX = 1500
let catMinWalkLimitX = 500
let catSpeed = 1;
//Toaster-stuff
let toaster: PIXI.Container;
//Current game state, could be : handleMainMenu, handlePlay, handleGameOver
let gameState = handleMainMenu;
//Constants : Do not change unless you like refacto
const resources = PIXI.Loader.shared.resources

function backgroundAlignment(spriteSize: Sprite, windowSize: Window) {

  const imageRatio = spriteSize.width / spriteSize.height;
  const windowRatio = windowSize.innerWidth / windowSize.innerHeight;
  if (imageRatio > windowRatio) {
    spriteSize.height = spriteSize.height / (spriteSize.width / windowSize.innerWidth);
    spriteSize.width = windowSize.innerWidth;
    spriteSize.position.x = 0;
    spriteSize.position.y = (windowSize.innerHeight - spriteSize.height) / 2;
    console.log(`${spriteSize.height} image>Window ${spriteSize.width}`)
  } else {
    spriteSize.width = windowSize.innerWidth;
    spriteSize.height = windowSize.innerHeight;
    spriteSize.position.y = 0;
    spriteSize.position.x = (windowSize.innerWidth - spriteSize.width) / 2;
    console.log(`${spriteSize.height} window> Image ${spriteSize.width}`)
  }
}

export abstract class Actor extends PIXI.Graphics {

}

@Component({
  selector: 'catakiller-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  private app: PIXI.Application = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
  });

  ngOnInit(): void {
    console.log(window.innerHeight, window.innerWidth)
    document.body.appendChild(this.app.view);
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    app = this.app
    stage = this.app.stage

    //Using loader to cache and use pixie stuff
    PIXI.Loader.shared
      .add(images)
      .load(setup)
  };
}

function setup() {
  const backgroundSprite = new PIXI.Sprite(resources['background'].texture);
  //const catTexture = new PIXI.Sprite(resources['Waldo'].texture);
  const toasterIdle = new PIXI.Sprite(resources['toasterIdle'].texture);
  backgroundAlignment(backgroundSprite, window)
  stage.addChild(backgroundSprite);

  //Setting cat
  cat = new PIXI.Container();
  const catWalkAnimation = createAnimation(catWalkingFrames, catAnimationSpeed);
  catWalkAnimation.interactive = true;
  catWalkAnimation.buttonMode = true;
  catWalkAnimation.on('pointerdown', playSoundFunction('woop'))
  cat.addChild(catWalkAnimation)

  //Setting toaster
  toaster = new PIXI.Container();
  //toasterIdle.interactive = true;
  //toaster.buttonMode = true;
  //toasterIdle.on('pointerdown', playSoundFunction("toaster-start"))
  toaster.addChild(toasterIdle);

  //Actually starts the game by running gameLoop function.
  app.ticker.add((delta: number) => gameLoop(delta));
}

//Used to handle "scene" : MainMenu, Play
function gameLoop(delta: number) {
  elapsedTime += delta
  //gameStats is an alias for the current game state to run the correct function depending on... Well the state of the game.
  //It can be : handleMainMenu, handlePlay, handleGameOver
  gameState(delta);
}

function handleMainMenu(delta: number) {
  let isDisplayed = false;
  const testMessage = new PIXI.Text("Welcome ! o/", { align: 'center' });
  testMessage.position.set(400, 10)
  if (!isDisplayed) {
    stage.addChild(testMessage)
    isDisplayed = true;
  }

  //console.log(elapsedTime)

  if (elapsedTime > 100) {
    stage.removeChild(testMessage)
    gameState = initPlay
  }
}

//Used to display things on start
function initPlay() {

  gameState = handlePlay;
  stage.addChild(cat);
  cat.x = catStartPositionX;
  cat.y = catStartPositionY;
  stage.addChild(toaster);
  app.start();
}

//Used as main game loop
function handlePlay(delta: number) {
  updateCat(delta)
  toaster.x = 100;
  toaster.y = 300;
  //cat.x = 200.0 + Math.cos(elapsedTime / 50.0) * 100.0;
  //cat.y = window.innerHeight * 0.5 + Math.sin(elapsedTime / 50) * 50
}

//Used to handle *?guess what?*
function handleGameOver(delta: number) {
  //testMessage.text = "CAT DED, GAMEOV3R"
}


// --------------------- utils ------------------------- //
function playSoundFunction(soundName: string) {
  return function () { sound.play(soundName); }
}

function createAnimation(frames: Texture[], animationSpeed: number) {
  const animation = new PIXI.AnimatedSprite(frames);
  animation.animationSpeed = animationSpeed
  animation.play()
  return animation;
}


// --------------------- Cat controller ------------------------- //
function updateCat(delta: number) {
  cat.x += catSpeed;

  if(cat.x > catMaxWalkLimitX || cat.x < catMinWalkLimitX){
    catSpeed = -catSpeed
  }

  if(catSpeed > 0){
    cat.scale.x = -1;
  } else {
    cat.scale.x = 1;
  }
   

}

