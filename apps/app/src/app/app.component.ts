import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js'
import { htmlaudio, Sound, sound, SoundLibrary } from '@pixi/sound'
import { DisplayObject, Sprite, Texture, Ticker } from "pixi.js";
import { isIdentifier } from '@angular/compiler';

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

const toasterTriggeredFrames = [
  Texture.from("../assets/things/toaster/triggered/Pict1.png"),
  Texture.from("../assets/things/toaster/triggered/Pict2.png")
];

//Global variables
let app: PIXI.Application;
let stage: PIXI.Container;
let elapsedTime = 0.0;
let firstScreenPauseTimeInMs = 1000;
const messagePositionX = 400;
const messagePositionY = 10;
//Cat-stuff
let cat: PIXI.Container;
let catAnimationSpeed = 0.05;
let catStartPositionX = 1000;
let catStartPositionY = 600;
let catMaxWalkLimitX = 1500
let catMinWalkLimitX = 500
let catSpeed = 1;
const catTriggerChancePercent = 90;
const catDelayAfterEventMs = 3000;
//Toaster-stuff
let toaster: PIXI.Container;
let toasterAnimationSpeed = 0.05;
let toasterStartPositionX = 100;
let toasterStartPositionY = 300;
const toasterTimeToExplodeMs = 2000;
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
  toaster.interactive = true;
  toaster.buttonMode = true;
  toaster.on('pointerdown', onToasterClick)
  toaster.hitArea = new PIXI.Rectangle(0, 400, 400, 200);
  toaster.addChild(new PIXI.Sprite(resources['toasterIdle'].texture));

  //Actually starts the game by running gameLoop function.
  app.ticker.add((delta: number) => gameLoop(delta));
}

//Used to handle "scene" : MainMenu, Play
function gameLoop(delta: number) {

  elapsedTime += Ticker.shared.deltaMS
  //gameStats is an alias for the current game state to run the correct function depending on... Well the state of the game.
  //It can be : handleMainMenu, handlePlay, handleGameOver
  gameState(Ticker.shared.deltaMS);
}

const message = new PIXI.Text("Welcome ! o/", { align: 'center' });
let isDisplayed = false;
function handleMainMenu(delta: number) {
  if (!isDisplayed) {
    message.position.set(messagePositionX, messagePositionY)
    stage.addChild(message)
    isDisplayed = true;
  }

  if (elapsedTime > firstScreenPauseTimeInMs) {
    stage.removeChild(message)
    gameState = initPlay
  }
}

//Used to display things on start
function initPlay() {

  gameState = handlePlay;
  stage.addChild(cat);
  cat.x = catStartPositionX;
  cat.y = catStartPositionY;
  toaster.x = toasterStartPositionX;
  toaster.y = toasterStartPositionY;
  stage.addChild(toaster);
  app.start();
}

//Used as main game loop
function handlePlay(delta: number) {
  updateCat(delta)
  updateToaster(delta)
  checkForCollisions(delta)
}

//Used to handle *?guess what?*
function handleGameOver(delta: number) {
  displayMessage("CAT DED, GAMEOV3R")
}

function checkForCollisions(delta: number) {
  if (isRectangleColliding(cat, toaster) && Cat.doesTriggers()) {
    Toaster.triggerToaster()
    //gameState = handleGameOver
  }
}


// --------------------- utils ------------------------- //
function playSoundFunction(soundName: string) {
  return function () { sound.play(soundName); }
}

function displayMessage(text: string) {
  message.text = text;
  stage.addChild(message)
}

function createAnimation(frames: Texture[], animationSpeed: number) {
  const animation = new PIXI.AnimatedSprite(frames);
  animation.animationSpeed = animationSpeed
  animation.play()
  return animation;
}

//Yoinked code to check collision with two rectangles
function isRectangleColliding(r1: any, r2: any) {
  if (r2.hitArea != null) {
    r2 = new PIXI.Rectangle(r2.x + r2.hitArea.x, r2.y + r2.hitArea.y, r2.hitArea.width, r2.hitArea.height)
  }
  //Define the variables we'll need to calculate
  let isHit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  isHit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      isHit = true;
    } else {

      //There's no collision on the y axis
      isHit = false;
    }
  } else {

    //There's no collision on the x axis
    isHit = false;
  }

  return isHit;
};


// --------------------- Cat stuff ------------------------- //
function updateCat(delta: number) {
  cat.x += Cat.speed;

  //Change  direction is is at screen bounds
  if (cat.x > catMaxWalkLimitX || cat.x < catMinWalkLimitX) {
    Cat.speed = -Cat.speed
  }

  if (Cat.speed > 0) {
    cat.scale.x = -1;
  } else {
    cat.scale.x = 1;
  }

  if (Cat.isVisible) {
    Cat.elapsedTimeSinceEventMs += delta
  }
}


abstract class Cat {
  static isVisible: boolean = true;
  static elapsedTimeSinceEventMs: number;
  static speed: number = catSpeed;

  //Random % chance to trigger an event
  static doesTriggers() {
    //if cat is busy (not visible), should return false !
    const doesCatsTriggers: boolean = Cat.isCatVisible() && !Cat.isCatOnCooldown() && Math.random() * 100 < catTriggerChancePercent;
    console.log("So, does cat triggers ? " + doesCatsTriggers)
    return doesCatsTriggers;
  }

  static isCatVisible() {
    console.log("is cat visible ?" + Cat.isVisible);
    return Cat.isVisible
  }

  static isCatOnCooldown() {
    console.log("Elapsed time ?" + Cat.elapsedTimeSinceEventMs)
    return Cat.elapsedTimeSinceEventMs > catDelayAfterEventMs;
  }

  static switchVisibilityTo(isVisible: boolean) {
    //Changes the visibility of the cat container first
    cat.visible = isVisible;
    Cat.isVisible = isVisible
    //Stop it from moving while not visible, resume otherwise.
    if (isVisible) {
      Cat.speed = catSpeed;
    } else {
      Cat.speed = 0;
    }

  }
}



// --------------------- Toaster stuff ------------------------- //
function updateToaster(delta: number) {
  if (Toaster.isTriggered) {
    Toaster.elapsedTriggeredTimeMs += delta
    if (Toaster.elapsedTriggeredTimeMs >= Toaster.timeToExplose) {
      Toaster.explode();
    }
  }
}

function onToasterClick() {
  if (Toaster.isTriggered) {
    //handleSomething : god saves the cat
    Toaster.unTriggerToaster();
  } else {
    sound.play("toaster-start");
  }
}

//Why use singletons when you can have a freaking static class 
abstract class Toaster {
  static isTriggered: boolean = false;
  static elapsedTriggeredTimeMs: number = 0;
  static timeToExplose: number = toasterTimeToExplodeMs;

  static triggerToaster() {
    Cat.switchVisibilityTo(false);
    const toasterTriggeredAnimation = createAnimation(toasterTriggeredFrames, toasterAnimationSpeed)
    toaster.removeChildren(0)
    toaster.addChild(toasterTriggeredAnimation)
    Toaster.isTriggered = true;
  }

  static unTriggerToaster() {
    Cat.switchVisibilityTo(true);
    toaster.removeChildren(0)
    toaster.addChild(new PIXI.Sprite(resources['toasterIdle'].texture));
    Toaster.isTriggered = false;
    Toaster.elapsedTriggeredTimeMs = 0;
  }

  static explode() {
    Cat.switchVisibilityTo(false);
    console.log("boom, RIP the cat (animation coming soon)");
    gameState = handleGameOver;
  }
}

