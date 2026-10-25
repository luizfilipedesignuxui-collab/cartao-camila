import { buildWhatsAppShareUrl } from "./contact.ts";

/** Uma conexão anotada pela dona do cartão. Fica só no aparelho. */
export type ConnectionRecord = {
  id: string;
  name: string;
  context: string;
  nextStep: string;
  /** AAAA-MM-DD ou "" sem lembrete. */
  remindOn: string;
  /** ISO 8601. */
  createdAt: string;
};

export type ConnectionDraft = {
  name: string;
  context?: string;
  nextStep?: string;
  remindOn?: string;
};

export type ReminderStatus = "hoje" | "atrasado" | null;

export const CONNECTIONS_STORAGE_KEY = "cartao:conexoes:v1";

export const CONNECTION_CONTEXTS = ["Networking", "Parceria", "Oportunidade profissional"] as const;

export const LIMITS = { name: 60, context: 60, nextStep: 140 } as const;

function fit(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max).trim();
}

/** Data real no formato AAAA-MM-DD (rejeita 2026-02-30). */
export function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

export function generateId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // segue para o fallback
  }
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Cria a conexão. Só o nome é obrigatório; sem nome retorna null. */
export function createConnection(draft: ConnectionDraft, now: Date = new Date()): ConnectionRecord | null {
  const name = fit(draft.name, LIMITS.name);
  if (!name) return null;
  const remindOn = (draft.remindOn ?? "").trim();
  return {
    id: generateId(),
    name,
    context: fit(draft.context, LIMITS.context),
    nextStep: fit(draft.nextStep, LIMITS.nextStep),
    remindOn: isValidDate(remindOn) ? remindOn : "",
    createdAt: now.toISOString(),
  };
}

function normalizeRecord(value: unknown): ConnectionRecord | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.id !== "string" || !raw.id.trim()) return null;
  const name = fit(raw.name, LIMITS.name);
  if (!name) return null;
  const createdAt =
    typeof raw.createdAt === "string" && !Number.isNaN(Date.parse(raw.createdAt)) ? raw.createdAt : "";
  if (!createdAt) return null;
  return {
    id: raw.id,
    name,
    context: fit(raw.context, LIMITS.context),
    nextStep: fit(raw.nextStep, LIMITS.nextStep),
    remindOn: isValidDate(raw.remindOn) ? raw.remindOn : "",
    createdAt,
  };
}

/** Converte o texto guardado. Registros inválidos são ignorados; JSON quebrado vira lista vazia. */
export function parseConnections(raw: string | null): ConnectionRecord[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    const out: ConnectionRecord[] = [];
    for (const item of data) {
      const record = normalizeRecord(item);
      if (!record || seen.has(record.id)) continue;
      seen.add(record.id);
      out.push(record);
    }
    return out;
  } catch {
    return [];
  }
}

function defaultStorage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function loadConnections(storage: Storage | null = defaultStorage()): ConnectionRecord[] {
  if (!storage) return [];
  try {
    return parseConnections(storage.getItem(CONNECTIONS_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function saveConnections(
  list: readonly ConnectionRecord[],
  storage: Storage | null = defaultStorage(),
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/** Data local do aparelho em AAAA-MM-DD. */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function reminderStatus(remindOn: string, today: string): ReminderStatus {
  if (!isValidDate(remindOn)) return null;
  if (remindOn === today) return "hoje";
  if (remindOn < today) return "atrasado";
  return null;
}

/** Lembrete mais próximo primeiro; sem lembrete vai para o fim. Empate: mais recente primeiro. */
export function sortConnections(list: readonly ConnectionRecord[]): ConnectionRecord[] {
  return [...list].sort((a, b) => {
    if (a.remindOn && !b.remindOn) return -1;
    if (!a.remindOn && b.remindOn) return 1;
    if (a.remindOn !== b.remindOn) return a.remindOn < b.remindOn ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

/** 2026-10-25 → 25/10/2026. */
export function formatDate(value: string): string {
  if (!isValidDate(value)) return "";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

/** Texto para o WhatsApp com as conexões marcadas. Nenhuma = "". */
export function buildConnectionsMessage(list: readonly ConnectionRecord[]): string {
  if (list.length === 0) return "";
  const blocks = list.map((item) => {
    const lines = [`• ${item.context ? `${item.name} (${item.context})` : item.name}`];
    if (item.nextStep) lines.push(`  Próximo passo: ${item.nextStep}`);
    if (item.remindOn) lines.push(`  Lembrete: ${formatDate(item.remindOn)}`);
    return lines.join("\n");
  });
  return ["Minhas conexões:", "", ...blocks].join("\n");
}

export function buildConnectionsWhatsAppUrl(list: readonly ConnectionRecord[]): string | null {
  return buildWhatsAppShareUrl(buildConnectionsMessage(list));
}
