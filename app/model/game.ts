import { Piece, Side, Type } from './piece';
import { Coords } from './common';

export enum GameState {
  ON,
  OVER,
}

export class Game  { 
    get WHITE() { return Piece.side_to_string(Side.WHITE); }
    get BLACK() { return Piece.side_to_string(Side.BLACK); }

    positions: Piece[][] = Piece.START_POSITIONS;
    selected: Coords;
    captured: {[side: string]: Piece[]} = {};
    won: Side;
    state = GameState.ON;
    whoseTurn: Side;

    constructor(starts: Side) {
      this.whoseTurn = starts;
      this.captured[this.WHITE] = [];
      this.captured[this.BLACK] = [];
    }

    getPiece(c: Coords): Piece {
      if (c.x >= 0) {
        return this.positions[c.x][c.y];
      } else if (c.x == -1) {
        return this.captured[this.WHITE][c.y];
      } else {
        return this.captured[this.BLACK][c.y];
      }
    }

    selectPiece(c: Coords) {
      if (this.state == GameState.OVER) {
        return;
      }
      let piece = this.getPiece(c);
      if (!piece.canBeSelected()) {
        return;
      }
      if (piece.side != this.whoseTurn) {
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
      if (this.selected.x >= 0) {
        this.movePieceOnBoard(c);
      } else {
        this.putPieceOnBoard(c);
      }
    }

    movePieceOnBoard(c: Coords) {
      let movedPiece = this.positions[this.selected.x][this.selected.y];
      let emptyPiece = this.positions[c.x][c.y];
      this.positions[c.x][c.y] = movedPiece;
      this.positions[this.selected.x][this.selected.y] = emptyPiece;
      this.unselectAll();
      this.onPieceMoved(c, movedPiece, false);
    }

    putPieceOnBoard(c: Coords) {
      let side = this.selected.x == -1 ? Side.WHITE : Side.BLACK;
      console.log("side: " + side);
      let movedPiece = this.captured[Piece.side_to_string(side)][this.selected.y];
      this.positions[c.x][c.y] = movedPiece;
      this.captured[Piece.side_to_string(side)].splice(this.selected.y, 1);
      this.unselectAll();
      this.onPieceMoved(c, movedPiece, true);
    }

    capturePiece(c: Coords) {
      let movedPiece = this.positions[this.selected.x][this.selected.y];
      let moveToPiece = this.positions[c.x][c.y];
      this.positions[c.x][c.y] = movedPiece;
      this.positions[this.selected.x][this.selected.y] = Piece.EMPTY;
      this.captured[Piece.side_to_string(movedPiece.side)].push(moveToPiece.getOpposite());
      this.unselectAll();
      this.onPieceMoved(c, movedPiece, false);
      this.onPieceCaptured(moveToPiece);
    }

    onPieceMoved(c: Coords, piece: Piece, wasCaptured: boolean) {
      this.whoseTurn = this.opposite(this.whoseTurn);
      if (piece.type == Type.KING) {    
        if (c.x == 0 && piece.side == Side.WHITE) {
          this.gameOver(Side.WHITE);
        } else if (c.x == this.positions.length-1 && piece.side == Side.BLACK) {
          this.gameOver(Side.BLACK);
        }
      }
      if (piece.type == Type.PAWN) {    
        if (c.x == 0 || c.x == this.positions.length-1) {
          this.positions[c.x][c.y] = new Piece(piece.side, Type.SUPERPAWN);
        }
      }
    }

    onPieceCaptured(capturedPiece: Piece) {
      if (capturedPiece.type == Type.KING) {
        this.gameOver(this.opposite(capturedPiece.side));
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
      console.log("game over")
      this.won = winning;
      this.state = GameState.OVER;
    }

    opposite(side: Side): Side {
      return side == Side.BLACK ? Side.WHITE : Side.BLACK;
    }
}