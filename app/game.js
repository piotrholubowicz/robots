"use strict";
var piece_1 = require('./piece');
(function (GameState) {
    GameState[GameState["ON"] = 0] = "ON";
    GameState[GameState["OVER"] = 1] = "OVER";
})(exports.GameState || (exports.GameState = {}));
var GameState = exports.GameState;
var Game = (function () {
    function Game(starts) {
        this.positions = piece_1.Piece.START_POSITIONS;
        this.captured = {};
        this.state = GameState.ON;
        this.whoseTurn = starts;
        this.captured[this.WHITE] = [];
        this.captured[this.BLACK] = [];
    }
    Object.defineProperty(Game.prototype, "WHITE", {
        get: function () { return piece_1.Piece.side_to_string(piece_1.Side.WHITE); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "BLACK", {
        get: function () { return piece_1.Piece.side_to_string(piece_1.Side.BLACK); },
        enumerable: true,
        configurable: true
    });
    Game.prototype.getPiece = function (c) {
        if (c.x >= 0) {
            return this.positions[c.x][c.y];
        }
        else if (c.x == -1) {
            return this.captured[this.WHITE][c.y];
        }
        else {
            return this.captured[this.BLACK][c.y];
        }
    };
    Game.prototype.selectPiece = function (c) {
        if (this.state == GameState.OVER) {
            return;
        }
        var piece = this.getPiece(c);
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
        }
        else {
            this.updateAllEmptyToAvailable();
        }
    };
    Game.prototype.updateAvailableOrAttacked = function (c) {
        var piece = this.positions[c.x][c.y];
        for (var _i = 0, _a = piece.movements(); _i < _a.length; _i++) {
            var pos = _a[_i];
            var x2 = c.x + pos[0];
            var y2 = c.y + pos[1];
            if (this.isOutOfBounds(x2, y2)) {
                continue;
            }
            var otherPiece = this.positions[x2][y2];
            if (otherPiece.side == piece_1.Side.NONE) {
                otherPiece.state = "available";
            }
            else if (otherPiece.side == piece.side) {
            }
            else {
                otherPiece.state = "attacked";
            }
        }
    };
    Game.prototype.isOutOfBounds = function (x, y) {
        return x < 0 || x >= this.positions.length || y < 0 || y >= this.positions[0].length;
    };
    Game.prototype.movePiece = function (c) {
        var piece = this.positions[c.x][c.y];
        var movedPiece = this.getPiece(this.selected);
        if (this.selected.x >= 0) {
            var movedToPiece = piece;
            this.positions[c.x][c.y] = this.positions[this.selected.x][this.selected.y];
            this.positions[this.selected.x][this.selected.y] = movedToPiece;
        }
        else {
            var side = this.selected.x == -1 ? piece_1.Side.WHITE : piece_1.Side.BLACK;
            this.positions[c.x][c.y] = movedPiece;
            this.captured[piece_1.Piece.side_to_string(side)].splice(this.selected.y, 1);
        }
        this.unselectAll();
        this.onPieceMoved(c, movedPiece);
    };
    Game.prototype.capturePiece = function (c) {
        var movedPiece = this.positions[this.selected.x][this.selected.y];
        var moveToPiece = this.positions[c.x][c.y];
        this.positions[c.x][c.y] = movedPiece;
        this.positions[this.selected.x][this.selected.y] = piece_1.Piece.EMPTY;
        this.captured[piece_1.Piece.side_to_string(movedPiece.side)].push(moveToPiece.getOpposite());
        this.unselectAll();
        this.onPieceMoved(c, movedPiece);
        this.onPieceCaptured(moveToPiece);
    };
    Game.prototype.onPieceMoved = function (c, piece) {
        this.whoseTurn = this.opposite(this.whoseTurn);
        if (piece.type == piece_1.Type.KING) {
            if (c.x == 0 && piece.side == piece_1.Side.WHITE) {
                this.gameOver(piece_1.Side.WHITE);
            }
            else if (c.x == this.positions.length - 1 && piece.side == piece_1.Side.BLACK) {
                this.gameOver(piece_1.Side.BLACK);
            }
        }
    };
    Game.prototype.onPieceCaptured = function (capturedPiece) {
        if (capturedPiece.type == piece_1.Type.KING) {
            this.gameOver(this.opposite(capturedPiece.side));
        }
    };
    Game.prototype.unselectAll = function () {
        this.selected = undefined;
        for (var _i = 0, _a = this.positions; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var piece = row_1[_b];
                piece.state = "none";
            }
        }
        for (var side in this.captured) {
            for (var _c = 0, _d = this.captured[side]; _c < _d.length; _c++) {
                var piece = _d[_c];
                piece.state = "none";
            }
        }
    };
    Game.prototype.updateAllEmptyToAvailable = function () {
        for (var _i = 0, _a = this.positions; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_2 = row; _b < row_2.length; _b++) {
                var piece = row_2[_b];
                if (piece.type == piece_1.Type.EMPTY) {
                    piece.state = "available";
                }
            }
        }
    };
    Game.prototype.gameOver = function (winning) {
        console.log("game over");
        this.won = winning;
        this.state = GameState.OVER;
    };
    Game.prototype.opposite = function (side) {
        return side == piece_1.Side.BLACK ? piece_1.Side.WHITE : piece_1.Side.BLACK;
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map