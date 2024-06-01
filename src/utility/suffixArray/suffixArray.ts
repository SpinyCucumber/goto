import Immutable from "immutable";

interface SuffixArrayEntry<T> {
    suffix: string;
    values: T[];
}

export class SearchResult<T> {

    public readonly frequencies: Immutable.Map<T, number>

    constructor(frequencies: Iterable<[T, number]>) {
        this.frequencies = Immutable.Map(frequencies);
    }

}

export class SuffixArray<T>
{
    private readonly entries: Immutable.List<SuffixArrayEntry<T>>

    constructor(entries: Iterable<SuffixArrayEntry<T>>) {
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
        const frequencies = new Map<T, number>();
        for (const {values} of this.entries.slice(start, right)) {
            for (const value of values) {
                let frequency = frequencies.get(value) ?? 0;
                frequencies.set(value, frequency + 1);
            }
        }
        return new SearchResult(frequencies);
    }
}

export class SuffixArrayBuilder<T>
{
    // Map between suffixes and values which end with each suffix
    private suffixes = new Map<string, T[]>;

    addLabel(value: T, label: string) {
        const normalizedLabel = label.toLowerCase();
        for(let i = 0; i < normalizedLabel.length; i++) {
            const suffix = normalizedLabel.substring(i);
            let valueList = this.suffixes.get(suffix);
            if (valueList === undefined) {
                valueList = [];
                this.suffixes.set(suffix, valueList);
            }
            valueList.push(value);
        }
    }

    build() {
        const entries: SuffixArrayEntry<T>[] = Array.from(this.suffixes, ([suffix, values]) => ({suffix, values}));
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