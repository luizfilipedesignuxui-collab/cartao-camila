import { describe, expect, it, vi } from "vitest";
import { businessCard } from "../config/business-card.ts";
import {
  buildEmailComposeUrl,
  buildMailto,
  buildMapsSearchUrl,
  buildShareMessage,
  buildVCard,
  buildWhatsAppShareUrl,
  buildWhatsAppUrl,
  copyText,
  isAssetUrl,
  isHttpUrl,
  normalizeWhatsAppNumber,
  shareOrCopyLink,
} from "./contact.ts";

describe("normalizeWhatsAppNumber", () => {
  it("normaliza o celular da proposta para o formato internacional", () => {
    expect(normalizeWhatsAppNumber("(11) 93098-8181")).toBe("5511930988181");
  });

  it("aceita número que já inclui o código do país", () => {
    expect(normalizeWhatsAppNumber("+55 11 93098-8181")).toBe("5511930988181");
  });

  it("rejeita vazio e sequências curtas demais", () => {
    expect(normalizeWhatsAppNumber("")).toBeNull();
    expect(normalizeWhatsAppNumber("119309")).toBeNull();
  });
});

describe("links de contato", () => {
  it("monta WhatsApp com texto inicial", () => {
    const url = buildWhatsAppUrl("(11) 93098-8181", "Olá");
    expect(url).toBe("https://wa.me/5511930988181?text=Ol%C3%A1");
  });

  it("monta busca de mapa com a cidade informada", () => {
    expect(buildMapsSearchUrl("São Paulo, SP")).toBe(
      "https://www.google.com/maps/search/?api=1&query=S%C3%A3o%20Paulo%2C%20SP",
    );
    expect(buildMapsSearchUrl("")).toBeNull();
  });

  it("monta mailto com assunto", () => {
    expect(buildMailto("ochocamila.psi@gmail.com", "Olá Camila")).toBe(
      "mailto:ochocamila.psi@gmail.com?subject=Ol%C3%A1%20Camila",
    );
  });

  it("monta o Gmail para escrever o e-mail", () => {
    expect(buildEmailComposeUrl("ochocamila.psi@gmail.com", "Contato pelo cartão digital")).toBe(
      "https://mail.google.com/mail/?view=cm&fs=1&to=ochocamila.psi%40gmail.com&su=Contato+pelo+cart%C3%A3o+digital",
    );
    expect(buildEmailComposeUrl("nao-e-email")).toBeNull();
  });

  it("rejeita e-mail e URLs perigosas ou vazias", () => {
    expect(buildMailto("nao-e-email", "Assunto")).toBeNull();
    expect(isHttpUrl("")).toBe(false);
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isAssetUrl("")).toBe(false);
    expect(isAssetUrl("/curriculo.pdf")).toBe(true);
  });
});

describe("compartilhar cartão", () => {
  it("monta o texto e o WhatsApp sem número fixo", () => {
    const payload = buildShareMessage(businessCard, "https://exemplo.com/camila");
    expect(payload.title).toBe("Camila Ochoa, Psicóloga organizacional");
    expect(payload.url).toBe("https://exemplo.com/camila");
    expect(buildWhatsAppShareUrl(`${payload.text} ${payload.url}`)).toContain(
      "https://wa.me/?text=",
    );
    expect(buildWhatsAppShareUrl("")).toBeNull();
  });
});

describe("buildVCard", () => {
  it("gera um vCard 3.0 com nome, telefone, e-mail e CRP", () => {
    const vcard = buildVCard(businessCard);
    expect(vcard).toContain("BEGIN:VCARD");
    expect(vcard).toContain("VERSION:3.0");
    expect(vcard).toContain("FN:Camila Ochoa");
    expect(vcard).toContain("TITLE:Psicóloga organizacional");
    expect(vcard).toContain("ORG:Lab Yes!");
    expect(vcard).toContain("TEL;TYPE=CELL:+5511930988181");
    expect(vcard).toContain("EMAIL;TYPE=INTERNET:ochocamila.psi@gmail.com");
    expect(vcard).toContain("CRP 06/199974");
    expect(vcard).toContain("URL:https://www.linkedin.com/in/camilaochoa/");
    expect(vcard).not.toContain("exemplo.com");
    expect(vcard).not.toContain("URL:https://camila");
    expect(vcard).toContain("END:VCARD");
    expect(vcard?.endsWith("\r\n")).toBe(true);
  });

  it("não gera vCard sem nome ou sem telefone e e-mail", () => {
    expect(
      buildVCard({
        ...businessCard,
        fullName: "",
        firstName: "",
        lastName: "",
      }),
    ).toBeNull();
    expect(
      buildVCard({
        ...businessCard,
        phoneDisplay: "",
        email: "nao-e-email",
      }),
    ).toBeNull();
  });
});

describe("shareOrCopyLink", () => {
  it("copia o link quando o compartilhamento nativo não existe", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    await expect(
      shareOrCopyLink({
        title: "Camila Ochoa, Psicóloga organizacional",
        text: "Cartão",
        url: "https://exemplo.com/camila-ochoa",
      }),
    ).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith("https://exemplo.com/camila-ochoa");

    vi.unstubAllGlobals();
  });

  it("não trata cancelamento como sucesso", async () => {
    vi.stubGlobal("navigator", {
      share: vi.fn().mockRejectedValue(new DOMException("The operation was aborted.", "AbortError")),
      clipboard: { writeText: vi.fn() },
    });

    await expect(
      shareOrCopyLink({
        title: "Camila",
        text: "Cartão",
        url: "https://exemplo.com/camila-ochoa",
      }),
    ).resolves.toBe("cancelled");

    vi.unstubAllGlobals();
  });

  it("não copia texto vazio", async () => {
    const writeText = vi.fn();
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(copyText("   ")).resolves.toBe(false);
    expect(writeText).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
