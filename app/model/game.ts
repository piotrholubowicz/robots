import { Piece, Side, Type } from './piece';
import { Move } from './move';
import { Coords, Utils } from './common';

export enum GameState {
  ON,
  OVER,
}

export class Game  { 
    get WHITE() { return Piece.side_to_string(Side.WHITE); }
    get BLACK() { return Piece.side_to_string(Side.BLACK); }
    static get START_POSITIONS(): any[][] {
      return [
          [Piece.B_BISHOP, Piece.B_KING, Piece.B_ROOK],
          [Piece.EMPTY, Piece.B_PAWN, Piece.EMPTY],
          [Piece.EMPTY, Piece.W_PAWN, Piece.EMPTY],
          [Piece.W_ROOK, Piece.W_KING, Piece.W_BISHOP],
      ];
  } 

    pieces: Piece[][] = Game.START_POSITIONS;
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

    clone(): Game {
      let that = new Game(this.whoseTurn);
      for (let i=0; i<this.pieces.length; i++) {
        for (let j=0; j<this.pieces[0].length; j++) {
          that.pieces[i][j] = this.pieces[i][j].clone();
        }
      }
      that.selected = this.selected;
      for (let c of this.captured[this.WHITE]) {
        that.captured[this.WHITE].push(c.clone());
      }
      for (let c of this.captured[this.BLACK]) {
        that.captured[this.BLACK].push(c.clone());
      }
      that.won = this.won;
      that.state = this.state;
      return that;
    }

    makeMove(move: Move, intervalMs?: number) {
      this.selectPiece(move.src);
      if (intervalMs == undefined) {
        this.clicked(move.dst);
      } else {
        setTimeout(()=>{this.clicked(move.dst)}, intervalMs);
      }
    }

    clicked(c: Coords) {
      let piece = this.getPiece(c);
      switch(piece.state) {
        case "none":
        this.selectPiece(c);
        break;
        case "selected":
        this.unselectAll();
        break;
        case "available":
        this.movePiece(c);
        break;
        case "attacked":
        this.capturePiece(c);
        break;
      }
    }

    private getPiece(c: Coords): Piece {
      if (c.x >= 0) {
        return this.pieces[c.x][c.y];
      } else if (c.x == -1) {
        return this.captured[this.WHITE][c.y];
      } else {
        return this.captured[this.BLACK][c.y];
      }
    }

    private selectPiece(c: Coords) {
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

    private updateAvailableOrAttacked(c: Coords) {
      let piece = this.pieces[c.x][c.y];
      for (let pos of piece.movements()) {
        let x2 = c.x + pos[0];
        let y2 = c.y + pos[1];
        if (this.isOutOfBounds(x2, y2)) {
          continue;
        }
        let otherPiece = this.pieces[x2][y2];
        if (otherPiece.side == Side.NONE) {
          otherPiece.state = "available";
        } else if (otherPiece.side == piece.side) {
          // nothing
        } else {
          otherPiece.state = "attacked";
        }
      }
    }

    public isOutOfBounds(x: number, y: number): boolean {
      return x < 0 || x >= this.pieces.length || y < 0 || y >= this.pieces[0].length;
    }

    private movePiece(c: Coords) {
      if (this.selected.x >= 0) {
        this.movePieceOnBoard(c);
      } else {
        this.putPieceOnBoard(c);
      }
    }

    private movePieceOnBoard(c: Coords) {
      let movedPiece = this.pieces[this.selected.x][this.selected.y];
      let emptyPiece = this.pieces[c.x][c.y];
      this.pieces[c.x][c.y] = movedPiece;
      this.pieces[this.selected.x][this.selected.y] = emptyPiece;
      this.unselectAll();
      this.onPieceMoved(c, movedPiece, false);
    }

    private putPieceOnBoard(c: Coords) {
      let side = this.selected.x == -1 ? Side.WHITE : Side.BLACK;
      console.log("side: " + side);
      let movedPiece = this.captured[Piece.side_to_string(side)][this.selected.y];
      this.pieces[c.x][c.y] = movedPiece;
      this.captured[Piece.side_to_string(side)].splice(this.selected.y, 1);
      this.unselectAll();
      this.onPieceMoved(c, movedPiece, true);
    }

    private capturePiece(c: Coords) {
      let movedPiece = this.pieces[this.selected.x][this.selected.y];
      let moveToPiece = this.pieces[c.x][c.y];
      this.pieces[c.x][c.y] = movedPiece;
      this.pieces[this.selected.x][this.selected.y] = Piece.EMPTY;
      this.captured[Piece.side_to_string(movedPiece.side)].push(moveToPiece.getOpposite());
      this.unselectAll();
      this.onPieceMoved(c, movedPiece, false);
      this.onPieceCaptured(moveToPiece);
    }

    private onPieceMoved(c: Coords, piece: Piece, wasCaptured: boolean) {
      this.whoseTurn = this.opposite(this.whoseTurn);
      if (piece.type == Type.KING) {    
        if (c.x == 0 && piece.side == Side.WHITE) {
          this.gameOver(Side.WHITE);
        } else if (c.x == this.pieces.length-1 && piece.side == Side.BLACK) {
          this.gameOver(Side.BLACK);
        }
      }
      if (piece.type == Type.PAWN && !wasCaptured) {
        if (c.x == 0 || c.x == this.pieces.length-1) {
          this.pieces[c.x][c.y] = new Piece(piece.side, Type.SUPERPAWN);
        }
      }
    }

    private onPieceCaptured(capturedPiece: Piece) {
      if (capturedPiece.type == Type.KING) {
        this.gameOver(this.opposite(capturedPiece.side));
      }
    }

    private unselectAll() {
      this.selected = undefined;
      for (let row of this.pieces) {
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

    private updateAllEmptyToAvailable() {
      for (let row of this.pieces) {
        for (let piece of row) {
          if (piece.type == Type.EMPTY) {
            piece.state = "available";
          }
        }
      }
    }

    private gameOver(winning: Side) {
      console.log("game over")
      this.won = winning;
      this.state = GameState.OVER;
    }

    private opposite(side: Side): Side {
      return side == Side.BLACK ? Side.WHITE : Side.BLACK;
    }
}