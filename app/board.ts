import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Piece, Side, Type } from './piece';
import { Tile, TileClickedEvent } from './tile';
import { Game } from './game';

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

  handleTileClick(event: TileClickedEvent) {
    let tile = event.tile;
    switch(tile.piece.state) {
      case "none":
      this.game.selectPiece(tile.coords());
      break;
      case "selected":
      this.game.unselectAll();
      break;
      case "available":
      this.game.movePiece(tile.coords());
      break;
      case "attacked":
      this.game.capturePiece(tile.coords());
      break;
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