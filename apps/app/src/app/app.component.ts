import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js'
import { htmlaudio, sound } from '@pixi/sound'

//Step:1
//ToDo: Implement a interactable object
// ToDo: implement custom background

// Step2
// ToDo: Animate Object
// ToDo: implement Sound

export abstract class Actor extends PIXI.Graphics {

}


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
    // const bg =  PIXI.Texture.fromLoader("../assets/",'../assets/')
    const texture = PIXI.Texture.from('../assets/testdawg.png');
    const sprite1 = new PIXI.Sprite(texture);
    sprite1.anchor.set(0.5);
    sprite1._height= window.innerHeight
    sprite1._width= window.innerWidth
     sprite1.x = screen.width;
     sprite1.y = screen.height ;
    //this.app.ticker.add((delta)=> sprite1.rotation += 0.05 *delta);
    sprite1.interactive= true;
    sprite1.buttonMode = true;
    sprite1.on('pointerDown', onclick );
    this.app.stage.addChild(sprite1);

     function onclick(){
       sprite1.scale.x *= 1.25;
     }
  }
}
