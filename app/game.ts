import { Piece, Side, Type } from './piece';
import { Coords } from './common';

export class Game  { 
    positions: Piece[][] = Piece.START_POSITIONS;
    selected: Coords;
    captured: {[side: string]: Piece[]} = {};
    won: string;

    constructor() {
      this.captured[Piece.side_to_string(Side.WHITE)] = [];
      this.captured[Piece.side_to_string(Side.BLACK)] = [];
    }

    selectPiece(c: Coords) {
      let piece = this.positions[c.x][c.y];
      if (!piece.canBeSelected()) {
        return;
      }
      this.unselectAll();
      piece.state = "selected";
      this.selected = c;
      if (c.x >= 0) {
        this.updateAvailableOrAttacked(c);
      } else {
        this.updateAllEmptyToAvailable();
      }
    }

    updateAvailableOrAttacked(c: Coords) {
      let piece = this.positions[c.x][c.y];
      for (let pos of piece.movements()) {
        let x2 = c.x + pos[0];
        let y2 = c.y + pos[1];
        if (this.isOutOfBounds(x2, y2)) {
          continue;
        }
        let otherPiece = this.positions[x2][y2];
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

    movePiece(c: Coords) {
      let piece = this.positions[c.x][c.y];
      let movedPiece = this.positions[this.selected.x][this.selected.y];
      if (this.selected.x >= 0) {
        let movedToPiece = piece;
        this.positions[c.x][c.y] = this.positions[this.selected.x][this.selected.y];
        this.positions[this.selected.x][this.selected.y] = movedToPiece;
      } else {
        let side = this.selected.x == -1 ? Side.WHITE : Side.BLACK;
        this.positions[c.x][c.y] = movedPiece;
        this.captured[Piece.side_to_string(side)].splice(this.selected.y, 1);
      }
      this.unselectAll();
      this.onPieceMoved(c, movedPiece);
    }

    capturePiece(c: Coords) {
      let movedPiece = this.positions[this.selected.x][this.selected.y];
      let moveToPiece = this.positions[c.x][c.y];
      this.positions[c.x][c.y] = movedPiece;
      this.positions[this.selected.x][this.selected.y] = Piece.EMPTY;
      this.captured[Piece.side_to_string(movedPiece.side)].push(moveToPiece.getOpposite());
      this.unselectAll();
      this.onPieceMoved(c, movedPiece);
      this.onPieceCaptured(moveToPiece, movedPiece.side);
    }

    onPieceMoved(c: Coords, piece: Piece) {
      if (piece.type == Type.KING) {    
        if (c.x == 0 && piece.side == Side.WHITE) {
          this.gameOver(Side.WHITE);
        } else if (c.x == this.positions.length-1 && piece.side == Side.BLACK) {
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