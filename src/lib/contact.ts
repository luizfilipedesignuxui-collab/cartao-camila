import type { BusinessCardConfig } from "../config/business-card.ts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Aceita caminho local (`/arquivo.pdf`) ou URL http(s). Rejeita vazio e `javascript:`. */
export function isAssetUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("//")) return false;
  if (trimmed.startsWith("/")) {
    return !trimmed.startsWith("/\\") && !/\s/.test(trimmed);
  }
  return isHttpUrl(trimmed);
}

/**
 * Normaliza telefone brasileiro para dígitos internacionais, sem sinal de mais.
 * (11) 93098-8181 → 5511930988181
 */
export function normalizeWhatsAppNumber(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;

  let normalized = digits;
  if (
    !normalized.startsWith("55") &&
    (normalized.length === 10 || normalized.length === 11)
  ) {
    normalized = `55${normalized}`;
  }

  if (normalized.length < 12 || normalized.length > 15) return null;
  if (normalized.startsWith("55") && normalized.length !== 12 && normalized.length !== 13) {
    return null;
  }
  return normalized;
}

export function buildWhatsAppUrl(phone: string, message?: string): string | null {
  const number = normalizeWhatsAppNumber(phone);
  if (!number) return null;
  const url = new URL(`https://wa.me/${number}`);
  const text = message?.trim();
  if (text) url.searchParams.set("text", text);
  return url.toString();
}

export function buildMapsSearchUrl(location: string): string | null {
  const query = location.trim();
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildMailto(
  email: string,
  subject?: string,
  body?: string,
): string | null {
  if (!isEmail(email)) return null;
  const params: string[] = [];
  if (subject?.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`);
  if (body?.trim()) params.push(`body=${encodeURIComponent(body.trim())}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return `mailto:${email.trim()}${query}`;
}

/** Abre o Gmail para escrever. No navegador o mailto sozinho muitas vezes não faz nada. */
export function buildEmailComposeUrl(email: string, subject?: string): string | null {
  if (!isEmail(email)) return null;
  const url = new URL("https://mail.google.com/mail/");
  url.searchParams.set("view", "cm");
  url.searchParams.set("fs", "1");
  url.searchParams.set("to", email.trim());
  const text = subject?.trim();
  if (text) url.searchParams.set("su", text);
  return url.toString();
}

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\n|\r/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildVCard(card: BusinessCardConfig): string | null {
  const phone = normalizeWhatsAppNumber(card.phoneDisplay);
  const email = isEmail(card.email) ? card.email.trim() : "";
  if (!card.fullName.trim() || (!phone && !email)) return null;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(card.lastName)};${escapeVCard(card.firstName)};;;`,
    `FN:${escapeVCard(card.fullName)}`,
  ];

  if (card.role.trim()) lines.push(`TITLE:${escapeVCard(card.role.trim())}`);

  const organization = card.experiences.find((item) => item.organization.trim())?.organization.trim();
  if (organization) lines.push(`ORG:${escapeVCard(organization)}`);

  const note = [card.credential, card.summary].map((part) => part.trim()).filter(Boolean).join(". ");
  if (note) lines.push(`NOTE:${escapeVCard(note)}`);

  if (phone) lines.push(`TEL;TYPE=CELL:+${phone}`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${email}`);
  if (card.location.trim()) {
    lines.push(`ADR;TYPE=WORK:;;;${escapeVCard(card.location)};;;;`);
  }
  if (isHttpUrl(card.websiteUrl)) lines.push(`URL:${card.websiteUrl.trim()}`);
  if (isHttpUrl(card.linkedinUrl)) lines.push(`URL:${card.linkedinUrl.trim()}`);

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}

export function resolveCardUrl(publicUrl: string): string {
  const configured = publicUrl.trim();
  if (configured && isHttpUrl(configured)) return configured;
  if (typeof window === "undefined") return "";
  return window.location.href.split("#")[0] ?? "";
}

export function qrPointsToLocalAddress(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

export function fileSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function downloadTextFile(filename: string, content: string, mime: string): void {
  downloadBlob(new Blob([content], { type: mime }), filename);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function canShareFiles(files: File[]): boolean {
  return typeof navigator !== "undefined" && typeof navigator.canShare === "function" && navigator.canShare({ files });
}

export async function shareFiles(files: File[], title: string, text?: string): Promise<ShareResult> {
  if (!canShareFiles(files)) return "failed";
  try {
    await navigator.share({ files, title, text });
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    return "failed";
  }
}

export async function saveVCardToDevice(filename: string, vcard: string): Promise<ShareResult> {
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const file = new File([blob], filename, { type: "text/vcard" });
  const shared = await shareFiles([file], "Salvar contato");
  if (shared === "shared" || shared === "cancelled") return shared;
  downloadBlob(blob, filename);
  return "downloaded";
}

export function buildShareMessage(card: BusinessCardConfig, url: string): {
  title: string;
  text: string;
  url: string;
} {
  return {
    title: `${card.fullName}, ${card.role}`,
    text: `Cartão digital de ${card.fullName}, ${card.role}. ${card.specialty}.`,
    url,
  };
}

export function buildWhatsAppShareUrl(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export type ShareResult = "shared" | "copied" | "cancelled" | "failed" | "downloaded" | "whatsapp";

export async function copyText(value: string): Promise<boolean> {
  const text = value.trim();
  if (!text) return false;
  try {
    if (typeof navigator === "undefined" || !navigator.clipboard) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareOrCopyLink(data: {
  title: string;
  text: string;
  url: string;
}): Promise<ShareResult> {
  if (!data.url) return "failed";

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  return (await copyText(data.url)) ? "copied" : "failed";
}
