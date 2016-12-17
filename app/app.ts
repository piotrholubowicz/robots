import { Component } from '@angular/core';
import { Game } from './game';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.ng.html',
})
export class App  {
  game: Game = new Game();
}