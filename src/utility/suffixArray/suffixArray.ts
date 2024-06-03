import Immutable from "immutable";
import { Counter, FrozenCounter, type ICounter, type IFrozenCounter } from "../counter";

interface ISuffixArrayEntry<T> {
    suffix: string;
    values: IFrozenCounter<T>;
}

export interface ISearchResult<T> {
    frequencies: IFrozenCounter<T>;
}

export interface ISuffixArray<T> {
    search(term: string): ISearchResult<T>
}

export interface ISuffixArrayBuilder<T> {
    addLabel(value: T, label: string, amount: number | undefined): void
    build(): SuffixArray<T>
}

export class SearchResult<T> {

    public readonly frequencies: IFrozenCounter<T>

    constructor(frequencies: Iterable<[T, number]>) {
        this.frequencies = new FrozenCounter(frequencies);
    }

}

export class SuffixArray<T> implements ISuffixArray<T>
{
    private readonly entries: Immutable.List<ISuffixArrayEntry<T>>

    constructor(entries: Iterable<ISuffixArrayEntry<T>>) {
        this.entries = Immutable.List(entries);
    }

    search(term: string) {

        const normalizedTerm = term.toLowerCase();

        // Find first suffix that begins with term
        let left = 0;
        let right = this.entries.size;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (normalizedTerm > this.entries.get(mid)!.suffix) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }
        const start = left;

        // Find second suffix that begins with term
        right = this.entries.size;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (this.entries.get(mid)!.suffix.startsWith(normalizedTerm)) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }

        // Return all values contained in range
        // We count number of times each value occurs
        const frequencies = new Counter<T>();
        for (const {values} of this.entries.slice(start, right)) {
            frequencies.add(values);
        }
        return new SearchResult(frequencies);
    }
}

export class SuffixArrayBuilder<T> implements ISuffixArrayBuilder<T>
{
    // Map between suffixes and values which end with each suffix
    private suffixes = new Map<string, Counter<T>>;

    addLabel(value: T, label: string, amount = 1) {
        const normalizedLabel = label.toLowerCase();
        for(let i = 0; i < normalizedLabel.length; i++) {
            const suffix = normalizedLabel.substring(i);
            let counter = this.suffixes.get(suffix);
            if (counter === undefined) {
                counter = new Counter<T>();
                this.suffixes.set(suffix, counter);
            }
            counter.increment(value);
        }
    }

    build() {
        const entries = Array.from(this.suffixes, ([suffix, values]) => ({suffix, values: new FrozenCounter(values)}));
        entries.sort((a, b) => {
            if (a.suffix < b.suffix) {
                return -1;
            }
            if (a.suffix > b.suffix) {
                return 1;
            }
            return 0;
        });
        return new SuffixArray(entries);
    }
}