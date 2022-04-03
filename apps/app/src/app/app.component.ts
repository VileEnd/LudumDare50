import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js'
import { htmlaudio, Sound, sound , SoundLibrary } from '@pixi/sound'
import { DisplayObject, Sprite } from "pixi.js";

// Step2
// ToDo: Animate Object

function backgroundAlignment(spriteSize:Sprite, windowSize: Window ){

  const imageRatio = spriteSize.width/ spriteSize.height;
  const windowRatio = windowSize.innerWidth/windowSize.innerHeight;
  if(imageRatio > windowRatio) {
    spriteSize.height = spriteSize.height / (spriteSize.width / windowSize.innerWidth);
    spriteSize.width = windowSize.innerWidth;
    spriteSize.position.x = 0;
    spriteSize.position.y = (windowSize.innerHeight - spriteSize.height) / 2;
    console.log(`${ spriteSize.height} image>Window ${ spriteSize.width}`)
  }else{
    spriteSize.width =  windowSize.innerWidth;
    spriteSize.height = windowSize.innerHeight;
    spriteSize.position.y = 0;
    spriteSize.position.x = (windowSize.innerWidth - spriteSize.width) / 2;
    console.log(`${ spriteSize.height} window> Image ${ spriteSize.width}`)
  }
}

export abstract class Actor extends PIXI.Graphics {

}

const sounds:any [] = [
  sound.add('woop','../assets/sound/build1soundTest_01.mp3' ),
  sound.add('toaster-start','../assets/sound/toaster-start(short)_01.mp3')
]


@Component({
  selector: 'catakiller-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  private app: PIXI.Application = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias:true,
  });

  private actor: Actor[]=[];

  ngOnInit(): void {
    console.log(window.innerHeight, window.innerWidth)
    document.body.appendChild(this.app.view);
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    const texture1 = PIXI.Texture.from('../assets/backgrounds/CuisineV1.jpg');
    const texture2 = PIXI.Texture.from('../assets/catanimation/Animation-Waldo.gif');
    const toasterIdle = PIXI.Texture.from('../assets/things/toaster/idle/grille_pain.png');


    const sprite1 = new PIXI.Sprite(texture1);
    const cat = new PIXI.Sprite(texture2);
    const ToasterIdle= new PIXI.Sprite(toasterIdle);
    const catC = new PIXI.Container();
    const toasterI= new PIXI.Container();
    backgroundAlignment(sprite1,window)

    catC.interactive= true;
    catC.buttonMode = true;
    catC.on('pointerdown', onclick );
    this.app.stage.addChild(catC);

    this.app.stage.addChild(sprite1);

    toasterI.interactive = true;
    toasterI.buttonMode =true;
    toasterI.on('pointerdown', ToasterSound)
    this.app.stage.addChild(toasterI)

this.app.stage.addChild(catC);
catC.addChild(cat);
toasterI.addChild(ToasterIdle);

function onclick(){
      sounds[0].play();
     }

function ToasterSound(){
  sounds[1].play();
}

    let elapsed = 0.0;
    // Tell our application's ticker to run a new callback every frame, passing
    // in the amount of time that has passed since the last tick
    this.app.ticker.add((delta) => {
      // Add the time to our total elapsed time
      elapsed += delta;
      // Update the sprite's X position based on the cosine of our elapsed time.  We divide
      // by 50 to slow the animation down a bit...
      catC.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
      catC.y = window.innerHeight*0.6 + Math.sin(elapsed/50)*50
    });
  }
}
