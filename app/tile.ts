import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Piece, Side, Type } from './piece';

@Component({
  moduleId: module.id,
  selector: 'tile',
  templateUrl: './tile.ng.html',
  styleUrls: ['./tile.css']
})
export class Tile  {
  @Input() piece: Piece;
  @Input() x: number;
  @Input() y: number;

  @Output() clicked = new EventEmitter<TileClickedEvent>();

  tileClicked() {
    this.clicked.emit(new TileClickedEvent(this));
  }
}

export class TileClickedEvent {
  tile: Tile;
  constructor(tile: Tile) {
    this.tile = tile;
  }
}