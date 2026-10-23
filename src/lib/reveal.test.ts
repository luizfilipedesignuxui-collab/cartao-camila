import { describe, expect, it } from "vitest";
import { layersForCard, nextLayer, previousLayer } from "./reveal.ts";

describe("layersForCard", () => {
  it("mantém só entrada, identidade e contato", () => {
    expect(layersForCard()).toEqual([
      "entry",
      "identity",
      "connection",
    ]);
  });

  it("avança e volta sem pular o contato", () => {
    const layers = layersForCard();
    expect(nextLayer(layers, "entry")).toBe("identity");
    expect(nextLayer(layers, "connection")).toBeNull();
    expect(previousLayer(layers, "identity")).toBe("entry");
    expect(previousLayer(layers, "entry")).toBeNull();
  });
});
