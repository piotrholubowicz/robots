"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var piece_1 = require('./piece');
var common_1 = require('./common');
var Tile = (function () {
    function Tile() {
        this.clicked = new core_1.EventEmitter();
    }
    Tile.prototype.coords = function () {
        return new common_1.Coords(this.x, this.y);
    };
    Tile.prototype.tileClicked = function () {
        this.clicked.emit(new TileClickedEvent(this));
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', piece_1.Piece)
    ], Tile.prototype, "piece", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Tile.prototype, "x", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Tile.prototype, "y", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Tile.prototype, "clicked", void 0);
    Tile = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tile',
            templateUrl: './tile.ng.html',
            styleUrls: ['./tile.css']
        }), 
        __metadata('design:paramtypes', [])
    ], Tile);
    return Tile;
}());
exports.Tile = Tile;
var TileClickedEvent = (function () {
    function TileClickedEvent(tile) {
        this.tile = tile;
    }
    return TileClickedEvent;
}());
exports.TileClickedEvent = TileClickedEvent;
//# sourceMappingURL=tile.js.map