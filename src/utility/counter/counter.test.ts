import { expect, test } from "vitest";
import { Counter, FrozenCounter } from "./counter";

test("should increment", () => {
    const counter = new Counter<string>();
    counter.increment("x", 5);
    counter.increment("x", 2);
    expect(counter.get("x")).toBe(7);
});

test("should add", () => {
    const counterA = new Counter([["x", 10]]);
    const counterB = new Counter([["x", 5], ["z", 5]]);
    counterA.add(counterB);
    expect(counterA).toEqual(new Counter([["x", 15], ["z", 5]]));
});

test("should plus", () => {
    const counterA = new FrozenCounter([["a", 15], ["b", 2]]);
    const counterB = new FrozenCounter([["b", 8]]);
    expect(counterA.plus(counterB)).toEqual(new FrozenCounter([["a", 15], ["b", 10]]));
});