import { expect, test } from "vitest";
import { SuffixArrayBuilder } from "./suffixArray";

test("should search string array", () => {
    
    // Construct
    const array = ["apple", "tomato", "cat", "japan", "ant"];
    const builder = new SuffixArrayBuilder<string>();
    for (const string of array) {
        builder.addLabel(string, string);
    }
    const suffixArray = builder.build();

    // Test
    expect(suffixArray.search("at")).to.have.members(["tomato", "cat"]);
    expect(suffixArray.search("an")).to.have.members(["japan", "ant"]);
    expect(suffixArray.search("t")).to.have.members(["tomato", "cat", "ant"]);
    expect(suffixArray.search("tomato")).to.have.members(["tomato"]);
    expect(suffixArray.search("")).to.have.members(array);
    expect(suffixArray.search("abc")).to.have.members([]);
    
});