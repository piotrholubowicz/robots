import { Game, GameState } from './game';
import { Piece, Side, Type } from './piece';
import { Move } from './move';
import { Coords, Utils } from './common';

export class AI {
    depth: number;
    constructor(depth: number) {
        this.depth = depth;
    }

    nextMove(game: Game): Move {
        console.log("AI is thinking");
        if (this.depth == 0) { // random 
            let moves = this.getAllMoves(game);
            Utils.shuffle(moves);
            return moves[0];
        }
        return this.evaluatePossibleMoves(game, this.depth);
    }

    getAllMoves(game: Game): Move[] {
        let moves: Move[] = [];
        for (let i=0; i<game.pieces.length; i++) {
            for (let j=0; j<game.pieces[i].length; j++) {
                let piece = game.pieces[i][j];
                if (piece.side != game.whoseTurn) {
                    continue;
                }
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
        for (let i=0; i<game.pieces.length; i++) {
            for (let j=0; j<game.pieces[i].length; j++) {
                if (game.pieces[i][j].type == Type.EMPTY) {
                    for (let k=0; k<game.captured[Piece.side_to_string(game.whoseTurn)].length; k++) {
                        let q = game.whoseTurn == Side.WHITE ? -1 : -2;     
                        moves.push(new Move(new Coords(q,k), new Coords(i,j)));
                    }
                }
            }
        }
        return moves;
    }

    /**
     * Evaluates all possible moves from this position. If depth is 1, then it
     * evaluates the position after 1 move. If depth is 2, then it for each
     * move it checks its followup moves and assumes the one yielding lowest
     * score will be played. And so on.
     */
    evaluatePossibleMoves(originalGame: Game, depth: number, intend = ""): Move {
        let moves = this.getAllMoves(originalGame);
        for (let move of moves) {
            console.log(intend + "Considering " + move.toString() + " (" + depth + ")");
            let game = originalGame.clone();
            game.makeMove(move);
            if (depth == 1) {
                // don't look deeper, just evaluate the board
                move.value = this.evaluatePosition(game, originalGame.whoseTurn);
                console.log(intend + "Evaluating the position: " + move.value);
            } else {
                // pick the best move for the opponent from here
                let opponentsMove = this.evaluatePossibleMoves(game, depth-1, intend + " ");
                // if the best move gives them 0.7, then it's 0.3 for us
                move.value = 1 - opponentsMove.value;
                console.log(intend + "The best value for us: " + move.value);
            }
        }
        Utils.shuffle(moves);
        moves.sort((m1, m2) => m2.value-m1.value);
        return this.almostFirst(moves, 0.9, 3);
    }

    /**
     * Evaluates the position for the specified player. 1 means the player
     * wins, 0 means they lose, 0.5 is even.
     */
    evaluatePosition(game: Game, side: Side): number {
        // victory = 1, defeat = 0, else ratio of pawn count
        if (game.state == GameState.OVER) {
            if (game.won == side) {
                return 1.0;
            } else {
                return 0;
            }
        }
        return game.pieceCount[Piece.side_to_string(side)] / 8;
    }

    private almostFirst(moves: Move[], ratio: number, tries: number): Move {
        for (let i=0; i<tries; i++) {
            if (Math.random() < ratio || moves.length == i+1) {
                return moves[i];
            }
        }
        return moves[tries-1];
    }
}