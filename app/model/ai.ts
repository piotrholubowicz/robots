import { Game } from './game';
import { Piece, Side, Type } from './piece';
import { Coords, Utils } from './common';

export class AI {
    depth: number;
    constructor(depth: number) {
        this.depth = depth;
    }

    nextMove(game: Game): Move {
        let moves = this.getAllMoves(game);
        for (let move of moves) {
            this.evaluate(move, game);
        }
        Utils.shuffleInPlace(moves);
        moves.sort((m1, m2) => m2.value-m1.value);
        return moves[0];
    }

    getAllMoves(game: Game): Move[] {
        let moves: Move[] = [];
        for (let i=0; i<game.pieces.length; i++) {
            for (let j=0; j<game.pieces[i].length; j++) {
                let piece = game.pieces[i][j];
                for (let pos of piece.movements()) {
                    let x2 = i + pos[0];
                    let y2 = j + pos[1];
                    if (game.isOutOfBounds(x2, y2)) {
                        continue;
                    }
                    let otherPiece = game.pieces[x2][y2];
                    if (otherPiece.side == Side.NONE) {
                        // move
                        moves.push(new Move(new Coords(i,j), new Coords(x2,y2)));
                    } else if (otherPiece.side == piece.side) {
                        // nothing
                    } else {
                        // capture
                        moves.push(new Move(new Coords(i,j), new Coords(x2,y2)));
                    }
                }
            }
        }
        return moves;
    }

    evaluate(move: Move, game: Game) {
        // TODO do something better
        move.value = 0.5;
    }
}

export class Move {
    src: Coords;
    dst: Coords;
    value: number;

    constructor(src: Coords, dst: Coords) {
        this.src = src;
        this.dst = dst;
    }
}