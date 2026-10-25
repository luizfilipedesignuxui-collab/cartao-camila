import { businessCard } from "../config/business-card.ts";
import { cardLayerPath, navigateTo } from "../lib/app-location.ts";
import { fileSlug, isHttpUrl } from "../lib/contact.ts";
import { ActionIcon } from "./ActionIcon.tsx";
import { FirstMessage } from "./FirstMessage.tsx";
import { InkScene } from "./InkScene.tsx";
import { PhotoSlot } from "./PhotoSlot.tsx";

function linkedinHandle(url: string): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const inIndex = parts.findIndex((part) => part.toLowerCase() === "in");
    const handle = inIndex >= 0 ? parts[inIndex + 1] : parts.at(-1);
    return handle ? `in/${handle}` : "";
  } catch {
    return "";
  }
}

export function ConnectInvite() {
  const card = businessCard;
  const slug = fileSlug(card.fullName) || "cartao";
  const linkedin = isHttpUrl(card.linkedinUrl) ? card.linkedinUrl.trim() : "";
  const linkedinLabel = linkedinHandle(linkedin);

  function openCard() {
    navigateTo(cardLayerPath(slug, "identity"));
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-bg text-cream">
      <InkScene />
      <a className="skip-link" href="#conectar">
        Ir para conectar
      </a>
      <main
        id="conectar"
        className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-md flex-col overflow-y-auto overscroll-y-contain px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]"
      >
        <div className="my-auto flex w-full flex-col">
          <p className="text-xs tracking-[0.16em] text-cream/85 uppercase">Conectar</p>
          <div className="mt-5 self-center">
            <PhotoSlot src={card.photoSrc} name={card.fullName} size="lg" ring onDark />
          </div>
          <h1
            id="titulo-pagina"
            tabIndex={-1}
            className="mt-5 text-center text-[2rem] leading-[1.05] font-semibold tracking-[-0.04em] outline-none focus:outline-none focus-visible:outline-none"
          >
            {card.fullName}
          </h1>
          <p className="mt-2 text-center text-base text-cream">{card.role}</p>

          <section className="glass mt-8 rounded-lg px-5 py-6 text-ink" aria-labelledby="linkedin-card-title">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-brand-linkedin text-cream">
                <ActionIcon id="linkedin" tone="onMedia" />
              </span>
              <div>
                <h2 id="linkedin-card-title" className="text-base font-semibold">
                  LinkedIn
                </h2>
                <p className="mt-1 text-sm text-muted">{linkedinLabel || "LinkedIn"}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {card.role}. Só o essencial para conectar.
            </p>
            {linkedin ? (
              <>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-linkedin px-5 text-base font-semibold text-cream"
                >
                  <ActionIcon id="linkedin" tone="onMedia" />
                  Conectar no LinkedIn
                  <span className="sr-only">, abre o perfil de {card.fullName} no LinkedIn</span>
                </a>
                <FirstMessage card={card} linkedinUrl={linkedin} />
              </>
            ) : (
              <p className="mt-5 text-sm text-muted">O perfil do LinkedIn não está disponível neste cartão.</p>
            )}
          </section>

          <button
            type="button"
            className="cta-outline focus-ring-cream mt-8 flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-semibold"
            onClick={openCard}
          >
            Ver o restante do cartão
          </button>
        </div>
      </main>
    </div>
  );
}
