import { Coords } from './common';

export class Move {
    src: Coords;
    dst: Coords;
    value: number;

    constructor(src: Coords, dst: Coords) {
        this.src = src;
        this.dst = dst;
    }
}