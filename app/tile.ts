import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Piece, Side, Type } from './model/piece';
import { Coords } from './model/common';

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

  coords(): Coords {
    return new Coords(this.x, this.y);
  }

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