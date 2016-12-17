import { Piece, Side, Type } from './piece';
import { Tile } from './tile';

export class Game  { 
    positions: Piece[][] = Piece.START_POSITIONS;
    selected: Tile = undefined;
    captured: {[side: string]: Piece[]} = {};
    won: string;

    constructor() {
      this.captured[Piece.side_to_string(Side.WHITE)] = [];
      this.captured[Piece.side_to_string(Side.BLACK)] = [];
    }

    handleNoneClicked(tile: Tile) {
      if (!tile.piece.canBeSelected()) {
        return;
      }
      this.unselectAll();
      tile.piece.state = "selected";
      this.selected = tile;
      if (tile.x >= 0) {
        this.updateAvailableOrAttacked(tile);
      } else {
        this.updateAllEmptyToAvailable();
      }
    }

    updateAvailableOrAttacked(tile: Tile) {
      let piece = tile.piece;
      for (let pos of tile.piece.movements()) {
        let x = tile.x + pos[0];
        let y = tile.y + pos[1];
        if (this.isOutOfBounds(x, y)) {
          continue;
        }
        let otherPiece = this.positions[x][y];
        if (otherPiece.side == Side.NONE) {
          otherPiece.state = "available";
        } else if (otherPiece.side == piece.side) {
          // nothing
        } else {
          otherPiece.state = "attacked";
        }
      }
    }

    isOutOfBounds(x: number, y: number): boolean {
      return x < 0 || x >= this.positions.length || y < 0 || y >= this.positions[0].length;
    }

    handleSelectedClicked(tile: Tile) {
      this.unselectAll();
    }

    handleAvailableClicked(tile: Tile) {
      let movedPiece = this.selected.piece;
      if (this.selected.x >= 0) {
        let movedToPiece = tile.piece;
        this.positions[tile.x][tile.y] = this.positions[this.selected.x][this.selected.y];
        this.positions[this.selected.x][this.selected.y] = movedToPiece;
      } else {
        let side = this.selected.x == -1 ? Side.WHITE : Side.BLACK;
        this.positions[tile.x][tile.y] = movedPiece;
        this.captured[Piece.side_to_string(side)].splice(this.selected.y, 1);
      }
      this.unselectAll();
      this.onPieceMoved(tile, movedPiece);
    }

    handleAttackedClicked(tile: Tile) {
      let movedPiece = this.selected.piece;
      let moveToPiece = tile.piece;
      this.positions[tile.x][tile.y] = movedPiece;
      this.positions[this.selected.x][this.selected.y] = Piece.EMPTY;
      this.captured[Piece.side_to_string(movedPiece.side)].push(moveToPiece.getOpposite());
      this.unselectAll();
      this.onPieceMoved(tile, movedPiece);
      this.onPieceCaptured(moveToPiece, movedPiece.side);
    }

    onPieceMoved(tile: Tile, piece: Piece) {
      if (piece.type == Type.KING) {    
        if (tile.x == 0 && piece.side == Side.WHITE) {
          this.gameOver(Side.WHITE);
        } else if (tile.x == this.positions.length-1 && piece.side == Side.BLACK) {
          this.gameOver(Side.BLACK);
        }
      }
    }

    onPieceCaptured(capturedPiece: Piece, capturingSide: Side) {
      if (capturedPiece.type == Type.KING) {
        this.gameOver(capturingSide);
      }
    }

    unselectAll() {
      this.selected = undefined;
      for (let row of this.positions) {
        for (let piece of row) {
          piece.state = "none";
        }
      }
      for (let side in this.captured) {
        for (let piece of this.captured[side]) {
          piece.state = "none";
        }
      }
    }

    updateAllEmptyToAvailable() {
      for (let row of this.positions) {
        for (let piece of row) {
          if (piece.type == Type.EMPTY) {
            piece.state = "available";
          }
        }
      }
    }

    gameOver(winning: Side) {
      this.won = this.sideToName(winning);
    }

    sideToName(side: Side): string {
      // TODO customizable names
      return side == Side.WHITE ? "Białe" : "Czarne";
    }
}