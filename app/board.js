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
var piece_1 = require('./model/piece');
var game_1 = require('./model/game');
var ai_1 = require('./model/ai');
var Board = (function () {
    function Board() {
        this.newGame = new core_1.EventEmitter();
        this.aiSide = piece_1.Side.BLACK;
        this.ai = new ai_1.AI(1);
    }
    Object.defineProperty(Board.prototype, "WHITE", {
        // Templates can't access static value, so we redirect as follows.
        get: function () { return piece_1.Piece.side_to_string(piece_1.Side.WHITE); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "BLACK", {
        get: function () { return piece_1.Piece.side_to_string(piece_1.Side.BLACK); },
        enumerable: true,
        configurable: true
    });
    Board.prototype.ngOnChanges = function (changes) {
        // check if it's AI move on every new game
        if (changes['game'] != undefined) {
            this.checkAI();
        }
    };
    Board.prototype.handleTileClick = function (event) {
        this.game.clicked(event.tile.coords());
        this.checkAI();
    };
    Board.prototype.checkAI = function () {
        if (this.game.whoseTurn == this.aiSide && this.game.state != game_1.GameState.OVER) {
            console.log("AI is thinking");
            var move = this.ai.nextMove(this.game);
            console.log("AI will move from [" + move.src.x + "," + move.src.y + "] to [" + move.dst.x + "," + move.dst.y + "]");
            this.game.makeMove(move, 800);
        }
    };
    Board.prototype.newGameClicked = function () {
        this.newGame.emit();
    };
    Board.prototype.sideToName = function (side) {
        // TODO customizable names
        return side == piece_1.Side.WHITE ? "Białe" : "Czarne";
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', game_1.Game)
    ], Board.prototype, "game", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Board.prototype, "newGame", void 0);
    Board = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'board',
            templateUrl: './board.ng.html',
        }), 
        __metadata('design:paramtypes', [])
    ], Board);
    return Board;
}());
exports.Board = Board;
//# sourceMappingURL=board.js.map