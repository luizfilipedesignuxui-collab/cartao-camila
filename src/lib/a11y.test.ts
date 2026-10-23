import { describe, expect, it } from "vitest";
import { LAYER_ANNOUNCE, newWindowLabel } from "./a11y.ts";

describe("camada WCAG", () => {
  it("avisa quando o link abre em nova aba", () => {
    expect(newWindowLabel("LinkedIn", true)).toBe("LinkedIn, abre em nova aba");
    expect(newWindowLabel("E-mail")).toBe("E-mail");
  });

  it("nomeia as telas para o leitor de tela", () => {
    expect(LAYER_ANNOUNCE.entry).toContain("Entrada");
    expect(LAYER_ANNOUNCE.connection).toContain("Contato");
  });
});
