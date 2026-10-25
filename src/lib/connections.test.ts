import { describe, expect, it } from "vitest";
import {
  CONNECTIONS_STORAGE_KEY,
  LIMITS,
  buildConnectionsMessage,
  buildConnectionsWhatsAppUrl,
  createConnection,
  isValidDate,
  loadConnections,
  parseConnections,
  reminderStatus,
  saveConnections,
  sortConnections,
  type ConnectionRecord,
} from "./connections.ts";

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
}

function record(partial: Partial<ConnectionRecord> & { id: string }): ConnectionRecord {
  return {
    name: "Pessoa",
    context: "",
    nextStep: "",
    remindOn: "",
    createdAt: "2026-10-01T12:00:00.000Z",
    ...partial,
  };
}

describe("createConnection", () => {
  it("exige só o nome", () => {
    expect(createConnection({ name: "   " })).toBeNull();
    const item = createConnection({ name: "  Ana  Souza " }, new Date("2026-10-25T10:00:00Z"));
    expect(item).not.toBeNull();
    expect(item?.name).toBe("Ana Souza");
    expect(item?.context).toBe("");
    expect(item?.nextStep).toBe("");
    expect(item?.remindOn).toBe("");
    expect(item?.createdAt).toBe("2026-10-25T10:00:00.000Z");
    expect(item?.id).toBeTruthy();
  });

  it("aplica os limites", () => {
    const item = createConnection({
      name: "a".repeat(100),
      context: "b".repeat(100),
      nextStep: "c".repeat(300),
    });
    expect(item?.name).toHaveLength(LIMITS.name);
    expect(item?.context).toHaveLength(LIMITS.context);
    expect(item?.nextStep).toHaveLength(LIMITS.nextStep);
  });

  it("descarta data inválida", () => {
    expect(createConnection({ name: "Ana", remindOn: "2026-02-30" })?.remindOn).toBe("");
    expect(createConnection({ name: "Ana", remindOn: "amanhã" })?.remindOn).toBe("");
    expect(createConnection({ name: "Ana", remindOn: "2026-11-03" })?.remindOn).toBe("2026-11-03");
  });

  it("gera ids diferentes", () => {
    const a = createConnection({ name: "A" });
    const b = createConnection({ name: "B" });
    expect(a?.id).not.toBe(b?.id);
  });
});

describe("isValidDate", () => {
  it("aceita só datas reais AAAA-MM-DD", () => {
    expect(isValidDate("2024-02-29")).toBe(true);
    expect(isValidDate("2025-02-29")).toBe(false);
    expect(isValidDate("2026-13-01")).toBe(false);
    expect(isValidDate("25/10/2026")).toBe(false);
    expect(isValidDate("")).toBe(false);
    expect(isValidDate(20261025)).toBe(false);
  });
});

describe("sortConnections", () => {
  it("lembrete mais próximo primeiro e sem lembrete no fim", () => {
    const list = [
      record({ id: "sem", remindOn: "" }),
      record({ id: "dez", remindOn: "2026-12-01" }),
      record({ id: "out", remindOn: "2026-10-20" }),
      record({ id: "nov", remindOn: "2026-11-05" }),
    ];
    expect(sortConnections(list).map((item) => item.id)).toEqual(["out", "nov", "dez", "sem"]);
  });

  it("não altera a lista original", () => {
    const list = [record({ id: "b", remindOn: "2026-12-01" }), record({ id: "a", remindOn: "2026-10-01" })];
    sortConnections(list);
    expect(list[0].id).toBe("b");
  });
});

describe("reminderStatus", () => {
  it("marca Hoje e Atrasado", () => {
    expect(reminderStatus("2026-10-25", "2026-10-25")).toBe("hoje");
    expect(reminderStatus("2026-10-24", "2026-10-25")).toBe("atrasado");
    expect(reminderStatus("2026-10-26", "2026-10-25")).toBeNull();
    expect(reminderStatus("", "2026-10-25")).toBeNull();
  });
});

describe("storage", () => {
  it("salva e lê de volta", () => {
    const storage = memoryStorage();
    const item = createConnection({ name: "Ana", context: "Parceria", remindOn: "2026-11-01" });
    expect(item).not.toBeNull();
    expect(saveConnections([item!], storage)).toBe(true);
    expect(loadConnections(storage)).toEqual([item]);
  });

  it("storage corrompido vira lista vazia", () => {
    expect(loadConnections(memoryStorage({ [CONNECTIONS_STORAGE_KEY]: "{quebrado" }))).toEqual([]);
    expect(loadConnections(memoryStorage({ [CONNECTIONS_STORAGE_KEY]: '{"a":1}' }))).toEqual([]);
    expect(loadConnections(null)).toEqual([]);
  });

  it("ignora registros inválidos e mantém os bons", () => {
    const good = record({ id: "ok", name: "Ana", remindOn: "2026-02-30" });
    const raw = JSON.stringify([good, null, 42, { id: "sem-nome", name: "", createdAt: good.createdAt }, { name: "sem id" }]);
    const list = parseConnections(raw);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe("ok");
    expect(list[0].remindOn).toBe("");
  });

  it("falha de escrita não quebra", () => {
    const storage = memoryStorage();
    storage.setItem = () => {
      throw new Error("cheio");
    };
    expect(saveConnections([], storage)).toBe(false);
    const broken = memoryStorage();
    broken.getItem = () => {
      throw new Error("bloqueado");
    };
    expect(loadConnections(broken)).toEqual([]);
  });
});

describe("mensagem para o WhatsApp", () => {
  it("monta só com as conexões marcadas", () => {
    const text = buildConnectionsMessage([
      record({ id: "1", name: "Ana", context: "Parceria", nextStep: "Enviar proposta", remindOn: "2026-11-03" }),
      record({ id: "2", name: "Bruno" }),
    ]);
    expect(text).toBe(
      "Minhas conexões:\n\n• Ana (Parceria)\n  Próximo passo: Enviar proposta\n  Lembrete: 03/11/2026\n• Bruno",
    );
  });

  it("abre o WhatsApp sem número", () => {
    const url = buildConnectionsWhatsAppUrl([record({ id: "1", name: "Ana" })]);
    expect(url?.startsWith("https://wa.me/?text=")).toBe(true);
    expect(buildConnectionsWhatsAppUrl([])).toBeNull();
  });
});
