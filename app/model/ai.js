"use strict";
var game_1 = require('./game');
var piece_1 = require('./piece');
var move_1 = require('./move');
var common_1 = require('./common');
var AI = (function () {
    function AI(depth) {
        this.depth = depth;
    }
    AI.prototype.nextMove = function (game) {
        console.log("AI is thinking");
        if (this.depth == 0) {
            var moves = this.getAllMoves(game);
            common_1.Utils.shuffle(moves);
            return moves[0];
        }
        return this.evaluatePossibleMoves(game, this.depth);
    };
    AI.prototype.getAllMoves = function (game) {
        var moves = [];
        for (var i = 0; i < game.pieces.length; i++) {
            for (var j = 0; j < game.pieces[i].length; j++) {
                var piece = game.pieces[i][j];
                if (piece.side != game.whoseTurn) {
                    continue;
                }
                for (var _i = 0, _a = piece.movements(); _i < _a.length; _i++) {
                    var pos = _a[_i];
                    var x2 = i + pos[0];
                    var y2 = j + pos[1];
                    if (game.isOutOfBounds(x2, y2)) {
                        continue;
                    }
                    var otherPiece = game.pieces[x2][y2];
                    if (otherPiece.side == piece_1.Side.NONE) {
                        // move
                        moves.push(new move_1.Move(new common_1.Coords(i, j), new common_1.Coords(x2, y2)));
                    }
                    else if (otherPiece.side == piece.side) {
                    }
                    else {
                        // capture
                        moves.push(new move_1.Move(new common_1.Coords(i, j), new common_1.Coords(x2, y2)));
                    }
                }
            }
        }
        for (var i = 0; i < game.pieces.length; i++) {
            for (var j = 0; j < game.pieces[i].length; j++) {
                if (game.pieces[i][j].type == piece_1.Type.EMPTY) {
                    for (var k = 0; k < game.captured[piece_1.Piece.side_to_string(game.whoseTurn)].length; k++) {
                        var q = game.whoseTurn == piece_1.Side.WHITE ? -1 : -2;
                        moves.push(new move_1.Move(new common_1.Coords(q, k), new common_1.Coords(i, j)));
                    }
                }
            }
        }
        return moves;
    };
    /**
     * Evaluates all possible moves from this position. If depth is 1, then it
     * evaluates the position after 1 move. If depth is 2, then it for each
     * move it checks its followup moves and assumes the one yielding lowest
     * score will be played. And so on.
     */
    AI.prototype.evaluatePossibleMoves = function (originalGame, depth, intend) {
        if (intend === void 0) { intend = ""; }
        var moves = this.getAllMoves(originalGame);
        for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
            var move = moves_1[_i];
            console.log(intend + "Considering " + move.toString() + " (" + depth + ")");
            var game = originalGame.clone();
            game.makeMove(move);
            if (depth == 1) {
                // don't look deeper, just evaluate the board
                move.value = this.evaluatePosition(game, originalGame.whoseTurn);
                console.log(intend + "Evaluating the position: " + move.value);
            }
            else {
                // pick the best move for the opponent from here
                var opponentsMove = this.evaluatePossibleMoves(game, depth - 1, intend + " ");
                // if the best move gives them 0.7, then it's 0.3 for us
                move.value = 1 - opponentsMove.value;
                console.log(intend + "The best value for us: " + move.value);
            }
        }
        common_1.Utils.shuffle(moves);
        moves.sort(function (m1, m2) { return m2.value - m1.value; });
        // TODO make it less deterministic
        return moves[0];
    };
    /**
     * Evaluates the position for the specified player. 1 means the player
     * wins, 0 means they lose, 0.5 is even.
     */
    AI.prototype.evaluatePosition = function (game, side) {
        // make it simple. Victory = 1, defeat = 0, else 0.5
        if (game.state == game_1.GameState.OVER) {
            if (game.won == side) {
                return 1.0;
            }
            else {
                return 0;
            }
        }
        return 0.5;
    };
    return AI;
}());
exports.AI = AI;
//# sourceMappingURL=ai.js.map