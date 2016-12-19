export class Coords {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x
        this.y = y;
    }
}

export class Utils {
    static shuffle<T>(a: T[]): T[] {
        let j, x, i: number;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }
}