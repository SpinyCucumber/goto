interface SuffixArrayEntry<T> {
    suffix: string;
    values: T[];
}

export class SuffixArray<T>
{
    private entries: SuffixArrayEntry<T>[];

    constructor(entries: SuffixArrayEntry<T>[]) {
        this.entries = entries;
    }

    search(term: string) {

        // Find first suffix that begins with term
        let left = 0;
        let right = this.entries.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (term > this.entries[mid].suffix) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }
        const start = left;

        // Find second suffix that begins with term
        right = this.entries.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (this.entries[mid].suffix.startsWith(term)) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }

        // Return all values contained in range (must also remove duplicates)
        return Array.from(new Set(this.entries.slice(start, right).flatMap(entry => entry.values)));
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