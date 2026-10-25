import { Check, Copy, Pencil, Send } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { BusinessCardConfig } from "../config/business-card.ts";
import { copyText } from "../lib/contact.ts";
import {
  buildConnectionMessage,
  buildContextModes,
  messageDraftKey,
  parseContextParam,
  withContextParam,
  type ContextModeId,
} from "../lib/context-mode.ts";

type FirstMessageProps = {
  card: BusinessCardConfig;
  linkedinUrl: string;
};

function readDraft(id: ContextModeId): string | null {
  try {
    return window.sessionStorage.getItem(messageDraftKey(id));
  } catch {
    return null;
  }
}

function writeDraft(id: ContextModeId, text: string): void {
  try {
    window.sessionStorage.setItem(messageDraftKey(id), text);
  } catch {
    // sem sessionStorage o texto vale só enquanto a página estiver aberta
  }
}

function initialContext(): ContextModeId | null {
  if (typeof window === "undefined") return null;
  return parseContextParam(window.location.search);
}

function syncUrl(id: ContextModeId | null): void {
  try {
    const { pathname, search, hash } = window.location;
    window.history.replaceState(window.history.state, "", withContextParam(`${pathname}${search}${hash}`, id));
  } catch {
    // a URL é só um atalho; a tela funciona sem ela
  }
}

/** Bloco "Sua primeira mensagem" dentro do card do LinkedIn em /conectar. */
export function FirstMessage({ card, linkedinUrl }: FirstMessageProps) {
  const uid = useId();
  const ids = {
    title: `${uid}-titulo`,
    label: `${uid}-rotulo`,
    message: `${uid}-mensagem`,
    editor: `${uid}-editor`,
  };
  const modes = useMemo(() => buildContextModes(card), [card]);
  const [selected, setSelected] = useState<ContextModeId | null>(initialContext);
  const [drafts, setDrafts] = useState<Partial<Record<ContextModeId, string>>>(() => {
    const id = initialContext();
    const saved = id ? readDraft(id) : null;
    return id && saved !== null ? { [id]: saved } : {};
  });
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");

  const firstName = card.firstName.trim();
  const mode = modes.find((item) => item.id === selected) ?? null;
  const message = selected ? (drafts[selected] ?? buildConnectionMessage(firstName, selected)) : "";

  function choose(id: ContextModeId) {
    const next = selected === id ? null : id;
    setSelected(next);
    setEditing(false);
    setStatus("");
    syncUrl(next);
    if (next && drafts[next] === undefined) {
      const saved = readDraft(next);
      if (saved !== null) setDrafts((current) => ({ ...current, [next]: saved }));
    }
  }

  function edit(text: string) {
    if (!selected) return;
    setDrafts((current) => ({ ...current, [selected]: text }));
    writeDraft(selected, text);
  }

  async function copyMessage() {
    const ok = await copyText(message);
    setStatus(ok ? "Mensagem copiada." : "Não foi possível copiar. Selecione o texto e copie manualmente.");
  }

  async function sendOnLinkedin() {
    const ok = await copyText(message);
    setStatus(
      ok
        ? "Mensagem copiada. No LinkedIn, abra Conectar ou Mensagem, cole o texto e envie."
        : "Não foi possível copiar. Copie o texto acima e cole no LinkedIn.",
    );
  }

  return (
    <div className="mt-6 border-t border-line pt-6" role="region" aria-labelledby={ids.title}>
      <h3 id={ids.title} className="text-base font-semibold">
        Sua primeira mensagem
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        O LinkedIn não abre conversa com texto pronto. Prepare a mensagem aqui, copie e cole lá.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Escolha networking, parcerias ou oportunidades para ver uma sugestão de mensagem.
      </p>

      <p id={ids.label} className="mt-5 text-sm font-semibold">
        Contexto da conexão (opcional)
      </p>
      <div role="group" aria-labelledby={ids.label} className="mt-3 flex flex-wrap gap-2">
        {modes.map((item) => {
          const pressed = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => choose(item.id)}
              className={`focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                pressed ? "bg-ink text-cream" : "bg-surface text-ink shadow-[inset_0_0_0_2px_var(--color-ink)]"
              }`}
            >
              {pressed ? <Check className="size-4" aria-hidden="true" /> : null}
              {item.label}
            </button>
          );
        })}
      </div>

      {mode ? (
        <div className="mt-5">
          {mode.lead || mode.highlights.length > 0 ? (
            <div className="text-sm text-muted">
              {mode.lead ? <p className="leading-relaxed">{mode.lead}</p> : null}
              {mode.highlights.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 leading-snug" aria-label={`Destaques para ${mode.label}`}>
                  {mode.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {editing ? (
            <div className="mt-4">
              <label htmlFor={ids.editor} className="text-sm font-semibold">
                Sua mensagem
              </label>
              <textarea
                id={ids.editor}
                value={message}
                onChange={(event) => edit(event.target.value)}
                rows={6}
                maxLength={1000}
                className="focus-ring mt-2 block w-full resize-y rounded-sm border border-line bg-surface p-3 text-sm leading-relaxed text-ink"
              />
            </div>
          ) : (
            <div className="mt-4">
              <p id={ids.message} className="text-sm font-semibold">
                Mensagem sugerida
              </p>
              <p
                aria-labelledby={ids.message}
                className="mt-2 rounded-sm border border-line bg-surface p-3 text-sm leading-relaxed whitespace-pre-line"
              >
                {message}
              </p>
            </div>
          )}

          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setEditing((open) => !open)}
              aria-expanded={editing}
              aria-controls={editing ? ids.editor : undefined}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold shadow-[inset_0_0_0_2px_var(--color-ink)]"
            >
              <Pencil className="size-4" aria-hidden="true" />
              {editing ? "Concluir edição" : "Editar mensagem"}
            </button>
            <button
              type="button"
              onClick={() => void copyMessage()}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold shadow-[inset_0_0_0_2px_var(--color-ink)]"
            >
              <Copy className="size-4" aria-hidden="true" />
              Copiar mensagem
            </button>
          </div>

          <p className="mt-5 text-sm leading-relaxed">
            Conecte-se com {firstName || "esta pessoa"} no LinkedIn ou envie a mensagem que você preparou.
          </p>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void sendOnLinkedin()}
            className="cta-on-cream focus-ring mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold"
          >
            <Send className="size-4" aria-hidden="true" />
            Enviar mensagem no LinkedIn
            <span className="sr-only">, copia a mensagem e abre o LinkedIn em nova aba</span>
          </a>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            A mensagem é copiada. No LinkedIn, cole e envie.
          </p>
        </div>
      ) : null}

      <p role="status" aria-live="polite" className={status ? "mt-3 text-sm font-semibold" : "sr-only"}>
        {status}
      </p>
    </div>
  );
}
