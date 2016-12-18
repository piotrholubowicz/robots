import { Component } from '@angular/core';
import { Side } from './model/piece';
import { Game } from './model/game';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.ng.html',
})
export class App  {
  starts = Side.WHITE;
  game: Game = new Game(this.starts);

  handleNewGame() {
    this.starts = this.starts == Side.WHITE ? Side.BLACK : Side.WHITE;
    this.game = new Game(this.starts);
  }
}