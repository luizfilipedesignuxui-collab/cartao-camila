import type { BusinessCardConfig } from "../config/business-card.ts";

export type ContextModeId = "networking" | "parcerias" | "oportunidades";

export const CONTEXT_PARAM = "contexto";

export const CONTEXT_MODE_IDS: readonly ContextModeId[] = ["networking", "parcerias", "oportunidades"];

export type ContextMode = {
  id: ContextModeId;
  label: string;
  /** Frase curta tirada só da ficha. */
  lead: string;
  /** Destaques tirados só da ficha. Nada inventado. */
  highlights: string[];
};

export function isContextModeId(value: unknown): value is ContextModeId {
  return typeof value === "string" && (CONTEXT_MODE_IDS as readonly string[]).includes(value);
}

/** Lê `?contexto=` de uma query string. Valor inválido ou ausente = null. */
export function parseContextParam(search: string): ContextModeId | null {
  try {
    const value = new URLSearchParams(search).get(CONTEXT_PARAM)?.trim().toLowerCase() ?? "";
    return isContextModeId(value) ? value : null;
  } catch {
    return null;
  }
}

/** Troca só o parâmetro `contexto` e mantém o resto da URL. `null` remove o parâmetro. */
export function withContextParam(href: string, id: ContextModeId | null): string {
  const isAbsolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(href);
  const url = new URL(href, "https://cartao.local");
  if (id) url.searchParams.set(CONTEXT_PARAM, id);
  else url.searchParams.delete(CONTEXT_PARAM);
  if (isAbsolute) return url.toString();
  return `${url.pathname}${url.search}${url.hash}`;
}

function clean(values: readonly (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const text = (value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}

function joinLead(parts: readonly (string | undefined)[]): string {
  return clean(parts).join(" · ");
}

type CardFacts = Pick<
  BusinessCardConfig,
  "role" | "specialty" | "credential" | "competencies" | "experiences"
>;

/** Monta os três contextos só com o que existe na ficha. */
export function buildContextModes(card: CardFacts): ContextMode[] {
  const experiences = card.experiences.map((item) =>
    clean([item.role, item.organization]).join(", "),
  );

  return [
    {
      id: "networking",
      label: "Networking",
      lead: joinLead([card.role, card.specialty]),
      highlights: clean(card.competencies),
    },
    {
      id: "parcerias",
      label: "Parcerias",
      lead: joinLead([card.specialty]),
      highlights: clean(experiences),
    },
    {
      id: "oportunidades",
      label: "Oportunidades",
      lead: joinLead([card.role, card.credential]),
      highlights: clean([...experiences, ...card.competencies]),
    },
  ];
}

const MESSAGE_BODY: Record<ContextModeId, string> = {
  networking:
    "Conheci seu cartão digital e gostaria de ampliar minha rede de contatos profissionais. Achei interessante conhecer seu trabalho e acredito que podemos trocar experiências e conhecimentos. Vamos nos conectar?",
  parcerias:
    "Conheci seu cartão digital e gostaria de conversar sobre possíveis parcerias profissionais. Acredito que podemos encontrar oportunidades de colaboração que façam sentido para ambos. Você estaria aberta a conversarmos?",
  oportunidades:
    "Conheci seu cartão digital e gostaria de conversar sobre possíveis oportunidades profissionais relacionadas ao seu trabalho. Acredito que pode ser interessante trocarmos algumas ideias. Podemos conversar?",
};

/** Mensagem sugerida para o contexto. Sem contexto = string vazia. */
export function buildConnectionMessage(firstName: string, id: ContextModeId | null): string {
  if (!id) return "";
  const name = firstName.trim();
  const greeting = name ? `Olá, ${name}!` : "Olá!";
  return `${greeting} ${MESSAGE_BODY[id]}`;
}

/** Chave do texto editado no sessionStorage, uma por contexto. */
export function messageDraftKey(id: ContextModeId): string {
  return `cartao:mensagem:${id}`;
}
