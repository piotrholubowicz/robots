import { Game } from './game';
import { Coords } from './common';

export class AI {
    depth: number;
    constructor(depth: number) {
        this.depth = depth;
    }

    nextMove(game: Game): Move {
        return undefined;
    }
}

export class Move {
    src: Coords;
    dst: Coords;

    constructor(src: Coords, dst: Coords) {
        this.src = src;
        this.dst = dst;
    }
}