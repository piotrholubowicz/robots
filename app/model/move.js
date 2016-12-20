"use strict";
var Move = (function () {
    function Move(src, dst) {
        this.src = src;
        this.dst = dst;
    }
    Move.prototype.toString = function () {
        return "[" + this.src.x + "," + this.src.y + "] => [" + this.dst.x + "," + this.dst.y + "]";
    };
    return Move;
}());
exports.Move = Move;
//# sourceMappingURL=move.js.map