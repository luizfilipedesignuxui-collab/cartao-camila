import { describe, expect, it } from "vitest";
import { businessCard } from "../config/business-card.ts";
import type { BusinessCardConfig } from "../config/business-card.ts";
import { buildActionGroups } from "./actions.ts";

describe("buildActionGroups", () => {
  it("mostra só ações com dados reais da Camila", () => {
    const ids = buildActionGroups(businessCard).flatMap((group) =>
      group.actions.map((action) => action.id),
    );

    expect(ids).toEqual([
      "linkedin",
      "save-contact",
      "share",
      "whatsapp",
      "email",
      "experience",
      "opportunities",
      "download-qr",
    ]);
    expect(ids).not.toContain("resume-view");
    expect(ids).not.toContain("schedule");
  });

  it("inclui LinkedIn e currículo quando os endereços existem", () => {
    const card: BusinessCardConfig = {
      ...businessCard,
      linkedinUrl: "https://www.linkedin.com/in/exemplo",
      resumeUrl: "/curriculo-camila-ochoa.pdf",
      schedulingUrl: "https://cal.example/camila",
    };

    const ids = buildActionGroups(card).flatMap((group) =>
      group.actions.map((action) => action.id),
    );

    expect(ids).toContain("linkedin");
    expect(ids).toContain("resume-view");
    expect(ids).toContain("resume-download");
    expect(ids).toContain("schedule");
  });

  it("omite um grupo inteiro quando a opção é desligada", () => {
    const card: BusinessCardConfig = {
      ...businessCard,
      options: { ...businessCard.options, whatsapp: false, email: false, scheduling: false },
    };

    const groups = buildActionGroups(card);
    expect(groups.some((group) => group.id === "direct")).toBe(false);
  });

  it("não cria link de WhatsApp quebrado", () => {
    const card: BusinessCardConfig = {
      ...businessCard,
      phoneDisplay: "123",
    };
    const direct = buildActionGroups(card).find((group) => group.id === "direct");
    expect(direct?.actions.some((action) => action.id === "whatsapp")).toBe(false);
  });
});
