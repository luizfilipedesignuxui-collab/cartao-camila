import { describe, expect, it } from "vitest";
import { businessCard } from "../config/business-card.ts";
import {
  buildConnectionMessage,
  buildContextModes,
  isContextModeId,
  parseContextParam,
  withContextParam,
} from "./context-mode.ts";

describe("parseContextParam", () => {
  it("lê os três contextos válidos", () => {
    expect(parseContextParam("?contexto=networking")).toBe("networking");
    expect(parseContextParam("?contexto=parcerias")).toBe("parcerias");
    expect(parseContextParam("contexto=oportunidades&x=1")).toBe("oportunidades");
    expect(parseContextParam("?contexto=Networking")).toBe("networking");
  });

  it("ignora ausente ou inválido", () => {
    expect(parseContextParam("")).toBeNull();
    expect(parseContextParam("?contexto=")).toBeNull();
    expect(parseContextParam("?contexto=vendas")).toBeNull();
    expect(parseContextParam("?outro=networking")).toBeNull();
  });
});

describe("isContextModeId", () => {
  it("aceita só os ids conhecidos", () => {
    expect(isContextModeId("parcerias")).toBe(true);
    expect(isContextModeId("Parcerias")).toBe(false);
    expect(isContextModeId(1)).toBe(false);
  });
});

describe("withContextParam", () => {
  it("troca só o parâmetro contexto e mantém o resto", () => {
    expect(withContextParam("/conectar?utm=qr#topo", "parcerias")).toBe(
      "/conectar?utm=qr&contexto=parcerias#topo",
    );
    expect(withContextParam("/conectar?contexto=networking&utm=qr", "oportunidades")).toBe(
      "/conectar?contexto=oportunidades&utm=qr",
    );
  });

  it("remove o parâmetro com null", () => {
    expect(withContextParam("/conectar?contexto=networking&utm=qr", null)).toBe("/conectar?utm=qr");
    expect(withContextParam("/conectar?contexto=networking", null)).toBe("/conectar");
  });

  it("mantém URL absoluta", () => {
    expect(withContextParam("https://exemplo.com/conectar?a=1", "networking")).toBe(
      "https://exemplo.com/conectar?a=1&contexto=networking",
    );
  });
});

describe("buildConnectionMessage", () => {
  it("usa o primeiro nome na saudação", () => {
    const message = buildConnectionMessage("Camila", "networking");
    expect(message.startsWith("Olá, Camila! Conheci seu cartão digital")).toBe(true);
    expect(message.endsWith("Vamos nos conectar?")).toBe(true);
  });

  it("tem um texto por contexto", () => {
    expect(buildConnectionMessage("Camila", "parcerias")).toContain("possíveis parcerias profissionais");
    expect(buildConnectionMessage("Camila", "parcerias")).toContain("Você estaria aberta a conversarmos?");
    expect(buildConnectionMessage("Camila", "oportunidades")).toContain(
      "possíveis oportunidades profissionais relacionadas ao seu trabalho",
    );
    expect(buildConnectionMessage("Camila", "oportunidades").endsWith("Podemos conversar?")).toBe(true);
  });

  it("sem nome usa só Olá!", () => {
    expect(buildConnectionMessage("  ", "networking").startsWith("Olá! Conheci")).toBe(true);
  });

  it("sem contexto não há mensagem", () => {
    expect(buildConnectionMessage("Camila", null)).toBe("");
  });
});

describe("buildContextModes", () => {
  it("usa só dados da ficha", () => {
    const modes = buildContextModes(businessCard);
    expect(modes.map((mode) => mode.id)).toEqual(["networking", "parcerias", "oportunidades"]);
    const sources = [
      businessCard.role,
      businessCard.specialty,
      businessCard.credential,
      ...businessCard.competencies,
      ...businessCard.experiences.map((item) => `${item.role}, ${item.organization}`),
    ];
    for (const mode of modes) {
      for (const item of mode.highlights) expect(sources).toContain(item);
      for (const part of mode.lead.split(" · ").filter(Boolean)) expect(sources).toContain(part);
    }
  });

  it("não cria destaque quando a ficha está vazia", () => {
    const modes = buildContextModes({
      role: "",
      specialty: "",
      credential: "",
      competencies: [],
      experiences: [],
    });
    for (const mode of modes) {
      expect(mode.lead).toBe("");
      expect(mode.highlights).toEqual([]);
    }
  });
});
