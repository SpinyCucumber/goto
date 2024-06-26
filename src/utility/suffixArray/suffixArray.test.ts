import { expect, test } from "vitest";
import { SuffixArrayBuilder, SearchResult } from "./suffixArray";

test("should search string array", () => {
    
    // Construct
    const array = ["apple", "tomato", "cat", "japan", "ant"];
    const builder = new SuffixArrayBuilder<string>();
    for (const string of array) {
        builder.addLabel(string, string);
    }
    const suffixArray = builder.build();

    // Test
    expect(suffixArray.search("an")).toEqual(new SearchResult([["japan", 1], ["ant", 1]]));
    expect(suffixArray.search("t")).toEqual(new SearchResult([["cat", 1], ["ant", 1], ["tomato", 2]]));
    expect(suffixArray.search("tomato")).toEqual(new SearchResult([["tomato", 1]]));
    expect(suffixArray.search("abc")).toEqual(new SearchResult([]));
    
});