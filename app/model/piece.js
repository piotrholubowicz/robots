"use strict";
(function (Side) {
    Side[Side["WHITE"] = 0] = "WHITE";
    Side[Side["BLACK"] = 1] = "BLACK";
    Side[Side["NONE"] = 2] = "NONE";
})(exports.Side || (exports.Side = {}));
var Side = exports.Side;
(function (Type) {
    Type[Type["EMPTY"] = 0] = "EMPTY";
    Type[Type["KING"] = 1] = "KING";
    Type[Type["BISHOP"] = 2] = "BISHOP";
    Type[Type["ROOK"] = 3] = "ROOK";
    Type[Type["PAWN"] = 4] = "PAWN";
    Type[Type["SUPERPAWN"] = 5] = "SUPERPAWN";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
var N = [-1, 0];
var S = [1, 0];
var E = [0, 1];
var W = [0, -1];
var NE = [-1, 1];
var NW = [-1, -1];
var SE = [1, 1];
var SW = [1, -1];
var Piece = (function () {
    function Piece(side, type) {
        this.state = "none";
        this.side = side;
        this.type = type;
    }
    Object.defineProperty(Piece, "EMPTY", {
        get: function () { return new Piece(Side.NONE, Type.EMPTY); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "B_KING", {
        get: function () { return new Piece(Side.BLACK, Type.KING); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "B_BISHOP", {
        get: function () { return new Piece(Side.BLACK, Type.BISHOP); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "B_ROOK", {
        get: function () { return new Piece(Side.BLACK, Type.ROOK); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "B_PAWN", {
        get: function () { return new Piece(Side.BLACK, Type.PAWN); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "B_SUPERPAWN", {
        get: function () { return new Piece(Side.BLACK, Type.SUPERPAWN); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "W_KING", {
        get: function () { return new Piece(Side.WHITE, Type.KING); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "W_BISHOP", {
        get: function () { return new Piece(Side.WHITE, Type.BISHOP); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "W_ROOK", {
        get: function () { return new Piece(Side.WHITE, Type.ROOK); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "W_PAWN", {
        get: function () { return new Piece(Side.WHITE, Type.PAWN); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Piece, "W_SUPERPAWN", {
        get: function () { return new Piece(Side.WHITE, Type.SUPERPAWN); },
        enumerable: true,
        configurable: true
    });
    ;
    Piece.prototype.clone = function () {
        var that = new Piece(this.side, this.type);
        that.state = this.state;
        return that;
    };
    Piece.prototype.text = function () {
        return this.side + " " + this.type;
    };
    Piece.prototype.img = function () {
        return "img/" + this.side_to_string() + "_" + this.type_to_string() + ".png";
    };
    Piece.prototype.side_to_string = function () {
        return Piece.side_to_string(this.side);
    };
    Piece.side_to_string = function (side) {
        switch (side) {
            case Side.BLACK:
                return "b";
            case Side.WHITE:
                return "w";
            case Side.NONE:
                return "n";
        }
    };
    Piece.prototype.type_to_string = function () {
        switch (this.type) {
            case Type.EMPTY:
                return "empty";
            case Type.KING:
                return "king";
            case Type.BISHOP:
                return "bishop";
            case Type.ROOK:
                return "rook";
            case Type.PAWN:
                return "pawn";
            case Type.SUPERPAWN:
                return "superpawn";
        }
    };
    Piece.prototype.movements = function () {
        switch (this.type) {
            case Type.KING:
                return [N, S, E, W, NE, NW, SE, SW];
            case Type.BISHOP:
                return [NE, NW, SE, SW];
            case Type.ROOK:
                return [N, S, E, W];
            case Type.PAWN:
                return this.side == Side.BLACK ? [S] : [N];
            case Type.SUPERPAWN:
                if (this.side == Side.BLACK) {
                    return [N, S, E, W, SE, SW];
                }
                else {
                    return [N, S, E, W, NE, NW];
                }
            case Type.EMPTY:
            default:
                return [];
        }
    };
    Piece.prototype.canBeSelected = function () {
        return this.type != Type.EMPTY;
    };
    Piece.prototype.getOpposite = function () {
        return new Piece(this.side == Side.BLACK ? Side.WHITE : Side.BLACK, this.type);
    };
    return Piece;
}());
exports.Piece = Piece;
//# sourceMappingURL=piece.js.map