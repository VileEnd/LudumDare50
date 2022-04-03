import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js'
import { htmlaudio, Sound, sound , SoundLibrary } from '@pixi/sound'

//Step:1
//ToDo: Implement a interactable object
// ToDo: implement custom background

// Step2
// ToDo: Animate Object


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
    document.body.appendChild(this.app.view);
    this.actor.push(new Background());
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    const texture = PIXI.Texture.from('../assets/testdawg.png');
    const sprite1 = new PIXI.Sprite(texture);
    sprite1.anchor.set(0.4);
    sprite1._height= window.innerHeight
    sprite1._width= window.innerWidth
     sprite1.x = screen.width/4;
     sprite1.y = screen.height/4 ;
    //this.app.ticker.add((delta)=> sprite1.rotation += 0.05 *delta);
    sprite1.interactive= true;
    sprite1.buttonMode = true;
    sprite1.on('pointerdown', onclick );
    this.app.stage.addChild(sprite1);

     function onclick(){
      sounds[0].play();
     }
  }
}
