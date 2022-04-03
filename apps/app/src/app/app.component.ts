import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js'
import { htmlaudio, Sound, sound , SoundLibrary } from '@pixi/sound'
import { Sprite } from "pixi.js";

//Step:1
//ToDo: Implement a interactable object
// ToDo: implement custom background

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
  sound.add('woop','../assets/sound/build1soundTest_01.mp3' )
]

class Background extends Actor {
  hello:any;
};

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
    const texture = PIXI.Texture.from('../assets/backgrounds/CuisineV1.jpg');
    const sprite1 = new PIXI.Sprite(texture);
    //define ratio
    backgroundAlignment(sprite1,window)
    sprite1.interactive= true;
    sprite1.buttonMode = true;
    sprite1.on('pointerdown', onclick );
    this.app.stage.addChild(sprite1);

     function onclick(){
      sounds[0].play();
     }
  }
}
