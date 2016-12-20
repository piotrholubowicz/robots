"use strict";
var Coords = (function () {
    function Coords(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coords;
}());
exports.Coords = Coords;
var Utils = (function () {
    function Utils() {
    }
    Utils.shuffle = function (a) {
        for (var i = a.length; i; i--) {
            var j = Math.floor(Math.random() * i);
            var x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    };
    Utils.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=common.js.map