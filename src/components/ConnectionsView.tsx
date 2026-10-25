import { Check, MessageCircle, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { entregaPath, navigateTo } from "../lib/app-location.ts";
import {
  CONNECTION_CONTEXTS,
  LIMITS,
  buildConnectionsMessage,
  buildConnectionsWhatsAppUrl,
  createConnection,
  formatDate,
  loadConnections,
  reminderStatus,
  saveConnections,
  sortConnections,
  todayKey,
  type ConnectionRecord,
} from "../lib/connections.ts";
import { InkScene } from "./InkScene.tsx";

const inputClass =
  "focus-ring mt-2 block min-h-12 w-full rounded-sm border border-line bg-surface px-3 text-base text-ink";

/** Página privada não deve aparecer em buscadores. */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const previousTitle = document.title;
    document.title = "Minhas conexões";
    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);
}

export function ConnectionsView() {
  useNoIndex();
  const [connections, setConnections] = useState<ConnectionRecord[]>(() => loadConnections());
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [remindOn, setRemindOn] = useState("");
  const [nameError, setNameError] = useState("");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLHeadingElement>(null);

  const today = todayKey();
  const sorted = useMemo(() => sortConnections(connections), [connections]);
  const chosen = sorted.filter((item) => selected.has(item.id));
  const whatsappUrl = preview ? buildConnectionsWhatsAppUrl(chosen) : null;

  useEffect(() => {
    if (preview) previewRef.current?.focus();
  }, [preview]);

  function persist(next: ConnectionRecord[], message: string) {
    setConnections(next);
    const saved = saveConnections(next);
    setStatus(saved ? message : `${message} Não foi possível salvar neste aparelho.`);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const record = createConnection({ name, context, nextStep, remindOn });
    if (!record) {
      setNameError("Informe o nome da pessoa.");
      nameRef.current?.focus();
      return;
    }
    persist([...connections, record], `${record.name} foi adicionada à lista.`);
    setName("");
    setContext("");
    setNextStep("");
    setRemindOn("");
    setNameError("");
    nameRef.current?.focus();
  }

  function remove(record: ConnectionRecord) {
    persist(
      connections.filter((item) => item.id !== record.id),
      `${record.name} foi removida da lista.`,
    );
    setSelected((current) => {
      const next = new Set(current);
      next.delete(record.id);
      return next;
    });
    setPreview("");
  }

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPreview("");
  }

  function prepare() {
    const text = buildConnectionsMessage(chosen);
    if (!text) {
      setStatus("Marque ao menos uma conexão para preparar a mensagem.");
      return;
    }
    setPreview(text);
    setStatus("");
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-bg text-cream">
      <InkScene />
      <a className="skip-link" href="#conexoes">
        Ir para minhas conexões
      </a>
      <main
        id="conexoes"
        className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-md flex-col overflow-y-auto overscroll-y-contain px-5 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))]"
      >
        <p className="text-xs tracking-[0.16em] text-cream/90 uppercase">Privado</p>
        <h1
          id="titulo-pagina"
          tabIndex={-1}
          className="mt-2 text-[2rem] leading-none font-semibold tracking-[-0.04em] text-pretty outline-none"
        >
          Minhas conexões
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-cream">
          Anote quem você conheceu e o próximo passo. Fica só neste aparelho.
        </p>

        <section className="glass mt-6 rounded-lg px-5 py-6 text-ink" aria-labelledby="nova-conexao-titulo">
          <h2 id="nova-conexao-titulo" className="text-base font-semibold">
            Nova conexão
          </h2>
          <form className="mt-4 flex flex-col gap-4" onSubmit={submit} noValidate>
            <div>
              <label htmlFor="conexao-nome" className="text-sm font-semibold">
                Pessoa <span aria-hidden="true">*</span>
                <span className="sr-only">(obrigatório)</span>
              </label>
              <input
                ref={nameRef}
                id="conexao-nome"
                type="text"
                autoComplete="off"
                required
                aria-required="true"
                aria-invalid={nameError ? true : undefined}
                aria-describedby={nameError ? "conexao-nome-erro" : undefined}
                maxLength={LIMITS.name}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (nameError) setNameError("");
                }}
                className={inputClass}
              />
              {nameError ? (
                <p id="conexao-nome-erro" className="mt-2 text-sm font-semibold text-ink">
                  {nameError}
                </p>
              ) : null}
            </div>

            <div>
              <p id="conexao-contexto-rotulo" className="text-sm font-semibold">
                Contexto
              </p>
              <div role="group" aria-labelledby="conexao-contexto-rotulo" className="mt-2 flex flex-wrap gap-2">
                {CONNECTION_CONTEXTS.map((option) => {
                  const pressed = context === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => setContext(pressed ? "" : option)}
                      className={`focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold ${
                        pressed ? "bg-ink text-cream" : "bg-surface text-ink shadow-[inset_0_0_0_2px_var(--color-ink)]"
                      }`}
                    >
                      {pressed ? <Check className="size-4" aria-hidden="true" /> : null}
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="conexao-passo" className="text-sm font-semibold">
                Próximo passo
              </label>
              <input
                id="conexao-passo"
                type="text"
                autoComplete="off"
                maxLength={LIMITS.nextStep}
                value={nextStep}
                onChange={(event) => setNextStep(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="conexao-lembrete" className="text-sm font-semibold">
                Lembrete (opcional)
              </label>
              <input
                id="conexao-lembrete"
                type="date"
                value={remindOn}
                onChange={(event) => setRemindOn(event.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="cta-on-cream focus-ring flex min-h-12 items-center justify-center rounded-full px-5 text-base font-semibold"
            >
              Adicionar conexão
            </button>
          </form>
        </section>

        <section className="mt-8" aria-labelledby="lista-conexoes-titulo">
          <h2 id="lista-conexoes-titulo" className="text-lg font-semibold">
            Lista ({sorted.length})
          </h2>
          {sorted.length === 0 ? (
            <p className="mt-2 text-sm text-cream">Nenhuma conexão anotada ainda.</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-cream">Ordenada pelo lembrete mais próximo.</p>
              <ul className="mt-4 flex flex-col gap-3">
                {sorted.map((item) => {
                  const badge = reminderStatus(item.remindOn, today);
                  const checkId = `conexao-${item.id}`;
                  return (
                    <li key={item.id} className="glass rounded-md px-4 py-4 text-ink">
                      <div className="flex items-start gap-3">
                        <input
                          id={checkId}
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => toggle(item.id)}
                          className="focus-ring mt-0.5 size-6 shrink-0 accent-[var(--color-ink)]"
                          aria-describedby={`${checkId}-detalhes`}
                        />
                        <div className="min-w-0 flex-1">
                          <label htmlFor={checkId} className="block text-base font-semibold break-words">
                            {item.name}
                            {badge ? (
                              <span
                                className={`ml-2 inline-block rounded-full px-2 py-0.5 align-middle text-xs font-semibold ${
                                  badge === "atrasado" ? "bg-accent text-accent-ink" : "bg-ink text-cream"
                                }`}
                              >
                                {badge === "hoje" ? "Hoje" : "Atrasado"}
                              </span>
                            ) : null}
                          </label>
                          <div id={`${checkId}-detalhes`} className="mt-1 text-sm leading-snug text-muted">
                            {item.context ? <p>{item.context}</p> : null}
                            {item.nextStep ? <p>Próximo passo: {item.nextStep}</p> : null}
                            {item.remindOn ? <p>Lembrete: {formatDate(item.remindOn)}</p> : null}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(item)}
                          aria-label={`Remover ${item.name}`}
                          className="focus-ring -mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-ink/5"
                        >
                          <Trash2 className="size-5" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-sm text-cream">Marque as conexões que entram na mensagem.</p>
              <button
                type="button"
                onClick={prepare}
                className="cta focus-ring-cream mt-3 flex min-h-[52px] w-full items-center justify-center rounded-full px-5 text-base font-semibold"
              >
                Preparar mensagem
              </button>
            </>
          )}
        </section>

        {preview ? (
          <section className="glass mt-6 rounded-lg px-5 py-6 text-ink" aria-labelledby="previa-titulo">
            <h2 id="previa-titulo" ref={previewRef} tabIndex={-1} className="text-base font-semibold outline-none">
              Prévia da mensagem
            </h2>
            <p className="mt-3 rounded-sm border border-line bg-surface p-3 text-sm leading-relaxed whitespace-pre-wrap">
              {preview}
            </p>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-on-cream focus-ring mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Abrir no WhatsApp
                <span className="sr-only">, abre em nova aba para você escolher o contato</span>
              </a>
            ) : null}
            <p className="mt-2 text-xs leading-relaxed text-muted">
              No WhatsApp, escolha o contato e confirme o envio.
            </p>
          </section>
        ) : null}

        <p role="status" aria-live="polite" className={status ? "mt-4 text-sm font-semibold text-cream" : "sr-only"}>
          {status}
        </p>

        <button
          type="button"
          className="focus-ring-cream mt-6 min-h-11 self-start text-sm font-medium text-cream"
          onClick={() => navigateTo(entregaPath())}
        >
          Voltar para a entrega
        </button>
      </main>
    </div>
  );
}
