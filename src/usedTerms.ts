import { type ILink } from "./config";

export interface IUsedTerms {
    get(link: ILink): Iterable<[string, number]>;
    increment(link: ILink, term: string): void;
}


interface IUsedTermsEntry {
    [key:string]: number;
}

// Default implementation, uses localStorage
export class UsedTermsLocalStorage implements IUsedTerms {

    private getStorageKey(link: ILink) {
        return `usedTerms(${link.uri})`;
    }

    private getEntry(link: ILink): IUsedTermsEntry {
        const item = window.localStorage.getItem(this.getStorageKey(link));
        if (item === null) return {};
        return JSON.parse(item);
    }

    get(link: ILink): Iterable<[string, number]> {
        return Object.entries(this.getEntry(link));
    }

    increment(link: ILink, term: string): void {
        const entries = this.getEntry(link);
        entries[term] = (entries[term] ?? 0) + 1;
        window.localStorage.setItem(this.getStorageKey(link), JSON.stringify(entries));
    }

}