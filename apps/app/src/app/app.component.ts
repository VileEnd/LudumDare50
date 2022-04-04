import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js'
import { htmlaudio, Sound, sound, SoundLibrary } from '@pixi/sound'
import { DisplayObject, Sprite, Texture, Ticker } from "pixi.js";

// Step2
// ToDo: Animate Object


// --------------------- Sounds loading ------------------------- //
const sounds = [
  sound.add('woop', '../assets/sound/build1soundTest_01.mp3'),
  //toaster
  sound.add('toaster-start', '../assets/sound/toaster-start(short)_01.mp3'),
  sound.add('toaster-fuse', '../assets/sound/toaster-fuse(10s)_01.mp3'),
  sound.add('toaster-psch', '../assets/sound/toaster-psch(short)_01.mp3'),
  sound.add('toaster-explode', '../assets/sound/toaster-tic+boom(short)_01.mp3'),
  //door
  sound.add('door-start', '../assets/sound/door-fbiOpenUp(short)_01.mp3'),
  sound.add('door-sorrysir', '../assets/sound/door-ohSorrySir(short)_01.mp3'),
  sound.add('door-sniper', '../assets/sound/door-sniper(short)_01.mp3'),
  //carpet
  sound.add('carpet-scratch', '../assets/sound/carpet-scratching(9s)_01.mp3'),
  sound.add('carpet-shh', '../assets/sound/carpet-chut(short)_01.mp3'),
  sound.add('carpet-chomp', '../assets/sound/carpet-chomp(short)_01.mp3')
]


// --------------------- Images loading ------------------------- //
const images = [
  { name: "background", url: "../assets/backgrounds/CuisineV1.jpg" },
  { name: "toasterIdle", url: "../assets/things/toaster/idle/grille_pain.png" },
  { name: "doorIdle", url: "../assets/things/door/idle.png" },
  { name: "carpetIdle", url: "../assets/things/rug/idle/carpet.png" }
]

//cat
const catWalkingFrames = [
  Texture.from("../assets/catanimation/Walk1.png"),
  Texture.from("../assets/catanimation/Walk2.png")
];
const catIdleFrames = [
  Texture.from("../assets/catanimation/Idle1.png"),
  Texture.from("../assets/catanimation/Idle2.png")
];
//toaster
const toasterTriggeredFrames = [
  Texture.from("../assets/things/toaster/triggered/Pict1.png"),
  Texture.from("../assets/things/toaster/triggered/Pict2.png")
];
const toasterFailedFrames = [
  Texture.from("../assets/things/toaster/failed/1.png"),
  Texture.from("../assets/things/toaster/failed/2.png"),
  Texture.from("../assets/things/toaster/failed/3.png")
];
//door
const doorFailedFrames = [
  Texture.from("../assets/things/door/Failed/Image1.png"),
  Texture.from("../assets/things/door/Failed/Image2.png"),
  Texture.from("../assets/things/door/Failed/Image3.png")
];
//carpet
const carpetTriggeredFrames = [
  Texture.from("../assets/things/toaster/triggered/Pict1.png"),
  Texture.from("../assets/things/toaster/triggered/Pict2.png")
];
const carpetFailedFrames = [
  Texture.from("../assets/things/toaster/failed/1.png"),
  Texture.from("../assets/things/toaster/failed/2.png"),
  Texture.from("../assets/things/toaster/failed/3.png")
]


//---- Global variables
let app: PIXI.Application;
let stage: PIXI.Container;
let elapsedTime = 0.0;
let cat: PIXI.Container;
let toaster: PIXI.Container;
let door: PIXI.Container;
let carpet: PIXI.Container;
//Current game state, could be : handleMainMenu, handlePlay, handleGameOver
let gameState = handleMainMenu;
//---- Constants
//Game Stuff
const firstScreenPauseTimeInMs = 1000;
const messagePositionX = 400;
const messagePositionY = 10;
const welcomeMessage = "Welcome ! o/"
const gameOverMessage = "CAT DED, GAMEOV3R"
const respawnDelayMs = 5000;
//Cat-stuff
const catAnimationSpeed = 0.05;
const catStartPositionX = 1000;
const catStartPositionY = 600;
const catMaxWalkLimitX = 1600
const catMinWalkLimitX = 500
const catSpeed = 1;
const catLives = 3;
const catTriggerChancePercent = 90;
const catDelayAfterEventMs = 4000;
const catDelayAfterTriggerOrUnTriggerChanceMs = 1000;
//Toaster-stuff
const toasterTriggeredAnimationSpeed = 0.05;
const toasterFailedAnimationSpeed = 0.03;
const toasterStartPositionX = 100;
const toasterStartPositionY = 300;
const toasterTimeToFailMs = 2000;
//Door-stuff
const doorTriggeredAnimationSpeed = 0.05;
const doorFailedAnimationSpeed = 0.03;
const doorStartPositionX = -0;
const doorStartPositionY = 0;
const doorTimeToFailMs = 4000;
//Carpet-stuff
const carpetTriggeredAnimationSpeed = 0.05;
const carpetFailedAnimationSpeed = 0.03;
const carpetStartPositionX = 500;
const carpetStartPositionY = 500;
const carpetTimeToFailMs = 2000;
//Do not change unless you like refacto
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
  backgroundAlignment(backgroundSprite, window)
  stage.addChild(backgroundSprite);

  //Setting cat
  cat = new PIXI.Container();
  const catWalkAnimation = createAnimation(catWalkingFrames, catAnimationSpeed);
  cat.interactive = true;
  cat.buttonMode = true;
  cat.on('pointerdown', playSoundFunction('woop'))
  cat.addChild(catWalkAnimation)
  //Setting toaster
  toaster = new PIXI.Container();
  toaster.interactive = true;
  toaster.buttonMode = true;
  toaster.on('pointerdown', onToasterClick)
  toaster.hitArea = new PIXI.Rectangle(0, 400, 400, 200);
  toaster.addChild(new PIXI.Sprite(resources['toasterIdle'].texture));
  //Setting door
  door = new PIXI.Container();
  door.interactive = true;
  door.buttonMode = true;
  door.on('pointerdown', onDoorClick)
  door.hitArea = new PIXI.Rectangle(1760, 230, 170, 700); //ChangeMe
  const doorSprite = new PIXI.Sprite(resources['doorIdle'].texture)
  backgroundAlignment(doorSprite, window)
  door.addChild(doorSprite);
  //Setting carpet
  carpet = new PIXI.Container();
  carpet.interactive = true;
  carpet.buttonMode = true;
  carpet.on('pointerdown', onCarpetClick)
  carpet.hitArea = new PIXI.Rectangle(0, 400, 400, 200); //ChangeMe
  carpet.addChild(new PIXI.Sprite(resources['carpetIdle'].texture));

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

const message = new PIXI.Text(welcomeMessage, { align: 'center' });
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
  cat.x = catStartPositionX;
  cat.y = catStartPositionY;
  stage.addChild(cat);
  toaster.x = toasterStartPositionX;
  toaster.y = toasterStartPositionY;
  stage.addChild(toaster);
  //FIXME
  //door.scale.set(0.5,0.5)
  door.x = doorStartPositionX;
  door.y = doorStartPositionY;
  stage.addChild(door);
  carpet.x = carpetStartPositionX;
  carpet.y = carpetStartPositionY;
  app.start();
}

//Used as main game loop
function handlePlay(delta: number) {
  updateCat(delta)
  updateToaster(delta)
  updateDoor(delta)
  updateCarpet(delta)
  checkForCollisions(delta)
  checkRespawns(delta)
}

//Used to handle *?guess what?*
function handleGameOver(delta: number) {
  displayMessage(gameOverMessage)
}

function updateCat(delta: number) {
  console.log("is cat idle ? " + Cat.isIdle)
  if (!Cat.isIdle) {

    cat.x += Cat.speed;

    //Change  direction is is at screen bounds
    if ((cat.x > catMaxWalkLimitX && Cat.speed > 0) || (cat.x < catMinWalkLimitX && Cat.speed < 0)) {
      Cat.speed = -Cat.speed
    }

    if (Cat.speed > 0) {
      cat.scale.x = -1;
    } else {
      cat.scale.x = 1;
    }
  }

  if (Cat.isVisible) {
    Cat.elapsedTimeSinceEventMs += delta
    Cat.elapsedTimeSinceTriggerChance += delta
  }
}

function updateToaster(delta: number) {
  if (Toaster.isTriggered) {
    Toaster.elapsedTriggeredTimeMs += delta
    if (Toaster.elapsedTriggeredTimeMs >= toasterTimeToFailMs) {
      Toaster.explode();
    }
  }
}

function updateDoor(delta: number) {
  if (Door.isTriggered) {
    Door.elapsedTriggeredTimeMs += delta
    if (Door.elapsedTriggeredTimeMs >= doorTimeToFailMs) {
      Door.fail();
    }
  }
}

function updateCarpet(delta: number) {
  if (Carpet.isTriggered) {
    Carpet.elapsedTriggeredTimeMs += delta
    if (Carpet.elapsedTriggeredTimeMs >= carpetTimeToFailMs) {
      Carpet.fail();
    }
  }
}

function checkForCollisions(delta: number) {
  if (isRectangleColliding(cat, toaster) && Cat.doesTriggers()) {
    Toaster.trigger()
  }
  if (isRectangleColliding(cat, door) && Cat.doesTriggers()) {
    Door.trigger()
  }
}

function checkRespawns(delta: number) {
  if (Cat.justDied) {
    Cat.elapsedTimeSinceDeath += delta;
    if (Cat.elapsedTimeSinceDeath >= respawnDelayMs) {
      Cat.respawn()
      Toaster.unTrigger();
      Door.unTrigger();
      Carpet.unTrigger();
    }
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
abstract class Cat {
  static isVisible: boolean = true;
  static isIdle: boolean = false;
  static elapsedTimeSinceEventMs: number = 0;
  static elapsedTimeSinceTriggerChance: number = 0;
  static speed: number = catSpeed;
  static livesLeft: number = catLives;
  static justDied: boolean = false;
  static elapsedTimeSinceDeath: number = 0;

  //Random % chance to trigger an event
  static doesTriggers() {
    //if cat is busy (not visible), should return false !
    const doesCatsTriggers: boolean = Cat.isCatVisible() && !Cat.isCatOnCooldown() && !Cat.isCatOnEventCooldown() && Cat.getRandomChance() &&
      !Toaster.isTriggered && !Door.isTriggered && !Carpet.isTriggered;
    console.log("So, does cat triggers ? " + doesCatsTriggers)
    return doesCatsTriggers;
  }

  static isCatVisible() {
    return Cat.isVisible
  }

  static isCatOnCooldown() {
    //console.log("Elapsed time since last random enough ?  " + !(Cat.elapsedTimeSinceTriggerChance < catDelayAfterTriggerChanceMs))
    return Cat.elapsedTimeSinceTriggerChance < catDelayAfterTriggerOrUnTriggerChanceMs;
  }

  static isCatOnEventCooldown() {
   // console.log("Elapsed time since event enough ? " + !(Cat.elapsedTimeSinceEventMs < catDelayAfterEventMs))
    return Cat.elapsedTimeSinceEventMs < catDelayAfterEventMs;
  }

  static getRandomChance() {
    Cat.elapsedTimeSinceTriggerChance = 0;
    const randomChance = Math.random() * 100 < catTriggerChancePercent;
    //console.log("Random is OK ? " + randomChance)
    return randomChance;
  }

  static resetTimeSinceEventTimer() {
    Cat.elapsedTimeSinceEventMs = 0;
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

  static setIdle() {
    const catWalkAnimation = createAnimation(catIdleFrames, catAnimationSpeed);
    cat.removeChildren(0)
    cat.addChild(catWalkAnimation)
    Cat.isIdle = true;
  }

  static setWalking() {
    Cat.isIdle = false;
    const catWalkAnimation = createAnimation(catWalkingFrames, catAnimationSpeed);
    cat.removeChildren(0)
    cat.addChild(catWalkAnimation)
  }

  static removeLifeOrGameOver() {
    Cat.livesLeft -= 1;
    if (Cat.livesLeft <= 0) {
      gameState = handleGameOver;
    } else {
      Cat.justDied = true;
    }
  }

  static respawn() {
    cat.x = catStartPositionX;
    cat.y = catStartPositionY;
    Cat.switchVisibilityTo(true);
    Cat.justDied = false;
    Cat.elapsedTimeSinceDeath = 0;
  }
}



// --------------------- Toaster stuff ------------------------- //
function onToasterClick() {
  if (gameState != handleGameOver) {
    if (Toaster.isTriggered) {
      Toaster.unTrigger();
      sound.stop("toaster-fuse");
      sound.play("toaster-psch");
    }
  }
}

//Why use singletons when you can have a freaking static class 
abstract class Toaster {
  static isTriggered: boolean = false;
  static elapsedTriggeredTimeMs: number = 0;

  static trigger() {
    Cat.switchVisibilityTo(false);
    Cat.resetTimeSinceEventTimer()
    const toasterTriggeredAnimation = createAnimation(toasterTriggeredFrames, toasterTriggeredAnimationSpeed)
    toaster.removeChildren(0)
    toaster.addChild(toasterTriggeredAnimation)
    Toaster.isTriggered = true;
    sound.play("toaster-fuse");
  }

  static unTrigger() {
    Cat.switchVisibilityTo(true);
    Cat.resetTimeSinceEventTimer()
    toaster.removeChildren(0)
    toaster.addChild(new PIXI.Sprite(resources['toasterIdle'].texture));
    Toaster.isTriggered = false;
    Toaster.elapsedTriggeredTimeMs = 0;
  }

  static explode() {
    Cat.switchVisibilityTo(false);
    const toasterTriggeredAnimation = createAnimation(toasterFailedFrames, toasterFailedAnimationSpeed)
    toaster.removeChildren(0)
    toasterTriggeredAnimation.loop = false;
    toaster.addChild(toasterTriggeredAnimation)
    Toaster.isTriggered = false;
    Cat.removeLifeOrGameOver();
    sound.stop("toaster-fuse");
    sound.play("toaster-explode")
  }
}

// --------------------- Door stuff ------------------------- //
function onDoorClick() {
  if (gameState != handleGameOver) {
    if (Door.isTriggered) {
      Door.unTrigger();
      sound.stop("door-start");
      sound.play("door-sorrysir");
    }
  }
}

abstract class Door {
  static isTriggered: boolean = false;
  static elapsedTriggeredTimeMs: number = 0;

  static trigger() {
    Cat.switchVisibilityTo(true);
    Cat.setIdle()
    Cat.resetTimeSinceEventTimer()
    Door.isTriggered = true;
    sound.play("door-start");
  }

  static unTrigger() {
    Cat.switchVisibilityTo(true);
    Cat.resetTimeSinceEventTimer()
    Cat.setWalking()
    door.removeChildren(0)
    const doorSprite = new PIXI.Sprite(resources['doorIdle'].texture)
    backgroundAlignment(doorSprite, window)
    door.addChild(doorSprite);
    Door.isTriggered = false;
    Door.elapsedTriggeredTimeMs = 0;
  }

  static fail() {
    Cat.switchVisibilityTo(false);
    const doorTriggeredAnimation = createAnimation(doorFailedFrames, doorFailedAnimationSpeed)
    door.removeChildren(0)
    backgroundAlignment(doorTriggeredAnimation, window)
    doorTriggeredAnimation.loop = false;
    door.addChild(doorTriggeredAnimation)
    Door.isTriggered = false;
    Cat.removeLifeOrGameOver();
    sound.play("door-sniper")
  }
}


// --------------------- Carpet stuff ------------------------- //
function onCarpetClick() {
  if (gameState != handleGameOver) {
    if (Carpet.isTriggered) {
      Carpet.unTrigger();
      sound.stop("carpet-fuse");
      sound.play("carpet-psch");
    }
  }
}


abstract class Carpet {
  static isTriggered: boolean = false;
  static elapsedTriggeredTimeMs: number = 0;

  static trigger() {
    Cat.switchVisibilityTo(false);
    Cat.resetTimeSinceEventTimer()
    Carpet.isTriggered = true;
    sound.play("carpet-scratch");
  }

  static unTrigger() {
    Cat.switchVisibilityTo(true);
    Cat.resetTimeSinceEventTimer()
    carpet.removeChildren(0)
    carpet.addChild(new PIXI.Sprite(resources['carpetIdle'].texture));
    Carpet.isTriggered = false;
    Carpet.elapsedTriggeredTimeMs = 0;
  }

  static fail() {
    Cat.switchVisibilityTo(false);
    const carpetTriggeredAnimation = createAnimation(carpetFailedFrames, carpetFailedAnimationSpeed)
    carpet.removeChildren(0)
    carpetTriggeredAnimation.loop = false;
    carpet.addChild(carpetTriggeredAnimation)
    Carpet.isTriggered = false;
    Cat.removeLifeOrGameOver();
    sound.stop("carpet-scratch");
    sound.play("carpet-chomp")
  }
}