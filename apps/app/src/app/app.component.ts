import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js'
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';

export abstract class Actor extends PIXI.Graphics {
}


class Background extends Actor {
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
  });

  private actor: Actor[]=[];

  ngOnInit(): void {
    document.body.appendChild(this.app.view);
    this.actor.push(new Background());
  }
}
