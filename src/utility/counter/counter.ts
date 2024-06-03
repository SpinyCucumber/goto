import Immutable from "immutable";

export interface IFrozenCounter<T> extends Iterable<[T, number]> {
    plus(other: IFrozenCounter<T>): IFrozenCounter<T>;
    get(key: T): number | undefined;
}

export interface ICounter<T> extends IFrozenCounter<T> {
    // In-place increment
    increment(key: T, amount: number): void;
    increment(key: T): void;
    // In-place add
    add(other: IFrozenCounter<T>): void;
}

export class FrozenCounter<T> implements IFrozenCounter<T> {

    private readonly map: Immutable.Map<T, number>;

    constructor(iterable?: Iterable<[T, number]>) {
        this.map = Immutable.Map(iterable);
    }

    get(key: T): number | undefined {
        return this.map.get(key);
    }

    plus(other: IFrozenCounter<T>): IFrozenCounter<T> {
        // Create copy of this counter and add in-place
        // Return instance of "FrozenCounter"
        const result = new Counter(this);
        result.add(other);
        return new FrozenCounter(result);
    }

    [Symbol.iterator](): Iterator<[T, number], any, undefined> {
        return this.map[Symbol.iterator]();
    }

}

export class Counter<T> implements ICounter<T> {

    private readonly map: Map<T, number>;

    constructor(iterable?: Iterable<[T, number]>) {
        this.map = new Map(iterable);
    }

    get(key: T): number | undefined {
        return this.map.get(key);
    }

    increment(key: T, amount: number = 1) {
        let value = this.map.get(key) ?? 0;
        this.map.set(key, value + amount);
    }

    add(other: IFrozenCounter<T>): void {
        for (const [key, value] of other) {
            this.increment(key, value);
        }
    }

    plus(other: IFrozenCounter<T>): IFrozenCounter<T> {
        // Create copy of this counter and add in-place
        const result = new Counter(this);
        result.add(other);
        return result;
    }

    [Symbol.iterator](): Iterator<[T, number], any, undefined> {
        return this.map[Symbol.iterator]();
    }

}