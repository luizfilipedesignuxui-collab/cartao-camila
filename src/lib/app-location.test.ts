import { describe, expect, it } from "vitest";
import { cardLayerPath, cardPath, entryQrValue, parsePathname } from "./app-location.ts";
import { qrPointsToLocalAddress } from "./contact.ts";

describe("parsePathname", () => {
  it("abre a entrega só em /entrega", () => {
    expect(parsePathname("/entrega", "camila-ochoa")).toBe("entrega");
    expect(parsePathname("/entrega/", "camila-ochoa")).toBe("entrega");
    expect(parsePathname("/", "camila-ochoa")).toBe("card");
    expect(parsePathname("/camila-ochoa", "camila-ochoa")).toBe("card");
    expect(parsePathname("/conectar", "camila-ochoa")).toBe("conectar");
  });

  it("não abre outro cartão quando o slug não existe", () => {
    expect(parsePathname("/outro-usuario", "camila-ochoa")).toBe("missing");
  });
});

describe("entryQrValue", () => {
  it("codifica o convite público e nunca o LinkedIn", () => {
    expect(entryQrValue({ url: "https://cartao-camila.vercel.app" })).toBe(
      "https://cartao-camila.vercel.app/conectar",
    );
    expect(entryQrValue({ url: "https://cartao-camila.vercel.app/camila-ochoa" })).toBe(
      "https://cartao-camila.vercel.app/conectar",
    );
    expect(entryQrValue({ url: "https://cartao-camila.vercel.app" })).not.toContain("linkedin");
    expect(entryQrValue({ url: "" })).toBe("");
  });
});

describe("cardPath", () => {
  it("monta o caminho permanente do slug", () => {
    expect(cardPath("camila-ochoa")).toBe("/camila-ochoa");
    expect(cardPath("")).toBe("/");
  });
});

describe("cardLayerPath", () => {
  it("abre a identidade a partir do convite, sem voltar à entrada", () => {
    expect(cardLayerPath("camila-ochoa", "identity")).toBe("/camila-ochoa?layer=identity");
  });
});

describe("qrPointsToLocalAddress", () => {
  it("reconhece localhost e aceita endereço público", () => {
    expect(qrPointsToLocalAddress("http://127.0.0.1:5173/camila-ochoa")).toBe(true);
    expect(qrPointsToLocalAddress("http://localhost:5173/")).toBe(true);
    expect(qrPointsToLocalAddress("https://exemplo.com/camila-ochoa")).toBe(false);
  });
});
