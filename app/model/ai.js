"use strict";
var piece_1 = require('./piece');
var move_1 = require('./move');
var common_1 = require('./common');
var AI = (function () {
    function AI(depth) {
        this.depth = depth;
    }
    AI.prototype.nextMove = function (game) {
        var moves = this.getAllMoves(game);
        for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
            var move = moves_1[_i];
            this.evaluate(move, game);
        }
        common_1.Utils.shuffle(moves);
        moves.sort(function (m1, m2) { return m2.value - m1.value; });
        return moves[0];
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
        return moves;
    };
    AI.prototype.evaluate = function (move, game) {
        // TODO do something better
        move.value = 0.5;
    };
    return AI;
}());
exports.AI = AI;
//# sourceMappingURL=ai.js.map