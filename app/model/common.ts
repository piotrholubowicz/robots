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
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            let x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }

    static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}