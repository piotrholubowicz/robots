import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Piece, Side, Type } from './model/piece';
import { Tile, TileClickedEvent } from './tile';
import { Game, GameState } from './model/game';
import { AI } from './model/ai';

@Component({
  moduleId: module.id,
  selector: 'board',
  templateUrl: './board.ng.html',
})
export class Board implements OnChanges {
  // Templates can't access static value, so we redirect as follows.
  get WHITE() { return Piece.side_to_string(Side.WHITE); }
  get BLACK() { return Piece.side_to_string(Side.BLACK); }

  @Input() game: Game;
  @Output() newGame = new EventEmitter<any>();

  ai: AI;
  aiSide = Side.BLACK;

  constructor() {
    this.ai = new AI(2);
  }

  ngOnChanges(changes: SimpleChanges) {
    // check if it's AI move on every new game
    if (changes['game'] != undefined) {
      this.checkAI();
    }
  }

  handleTileClick(event: TileClickedEvent) {
    this.game.clicked(event.tile.coords());
    this.checkAI();
  }

  private checkAI() {
    if (this.game.whoseTurn == this.aiSide && this.game.state != GameState.OVER) {
      let move = this.ai.nextMove(this.game);
      console.log("AI will move " + move.toString());
      this.game.makeMove(move, 800);
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