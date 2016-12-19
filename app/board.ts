import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Piece, Side, Type } from './model/piece';
import { Tile, TileClickedEvent } from './tile';
import { Game } from './model/game';
import { AI } from './model/ai';

@Component({
  moduleId: module.id,
  selector: 'board',
  templateUrl: './board.ng.html',
})
export class Board  {
  // Templates can't access static value, so we redirect as follows.
  get WHITE() { return Piece.side_to_string(Side.WHITE); }
  get BLACK() { return Piece.side_to_string(Side.BLACK); }

  @Input() game: Game;
  @Output() newGame = new EventEmitter<any>();

  ai: AI;
  aiSide = Side.BLACK;

  constructor() {
    this.ai = new AI(1);
  }

  handleTileClick(event: TileClickedEvent) {
    this.game.clicked(event.tile.coords());

    // TODO put some timer for animation
    if (this.game.whoseTurn == this.aiSide) {
      console.log("AI is thinking");
      let move = this.ai.nextMove(this.game);
      console.log("AI will move from ["+move.src.x+","+move.src.y+"] to ["+move.dst.x+","+move.dst.y+"]");
      this.game.makeMove(move);
    }
  }

  newGameClicked() {
    this.newGame.emit();
  }

  sideToName(side: Side): string {
    // TODO customizable names
    return side == Side.WHITE ? "Białe" : "Czarne";
  }

}