import { useState } from "react";
import { businessCard } from "../config/business-card.ts";
import { cardPath, entryQrValue, navigateTo, resolvePublicCardUrl } from "../lib/app-location.ts";
import { buildShareMessage, copyText, fileSlug, shareOrCopyLink } from "../lib/contact.ts";
import { InkScene } from "./InkScene.tsx";
import { InstallGuide } from "./InstallGuide.tsx";
import { PhotoSlot } from "./PhotoSlot.tsx";
import { QrStudio } from "./QrStudio.tsx";

export function DeliveryView() {
  const card = businessCard;
  const slug = fileSlug(card.fullName) || "cartao";
  const publicCard = resolvePublicCardUrl({ publicUrl: card.publicUrl, slug });
  const connectUrl = entryQrValue(publicCard);
  const [status, setStatus] = useState("");
  const [showInstall, setShowInstall] = useState(false);
  const [showQr, setShowQr] = useState(false);

  function openCard() {
    navigateTo(cardPath(slug));
  }

  async function shareCard() {
    const result = await shareOrCopyLink(buildShareMessage(card, publicCard.url));
    if (result === "shared") setStatus("O cartão foi enviado.");
    if (result === "copied") setStatus("Link do cartão copiado.");
    if (result === "failed") setStatus("Não foi possível compartilhar nem copiar o link.");
  }

  async function copyUrl() {
    const copied = await copyText(connectUrl || publicCard.url);
    setStatus(copied ? "Link do cartão copiado." : "Não foi possível copiar o link.");
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-bg text-cream">
      <InkScene />
      <a className="skip-link" href="#entrega">
        Ir para a entrega
      </a>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {status}
      </p>
      <main
        id="entrega"
        className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-md flex-col overflow-y-auto px-5 pt-10 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <p className="text-xs tracking-[0.16em] text-cream/90 uppercase">Entrega</p>
        <h1
          id="titulo-pagina"
          tabIndex={-1}
          className="mt-2 text-[2rem] leading-none font-semibold tracking-[-0.04em] text-pretty outline-none"
        >
          Seu cartão está pronto
        </h1>
        <div className="mt-6 flex items-center gap-4">
          <PhotoSlot src={card.photoSrc} name={card.fullName} size="lg" onDark />
          <div>
            <p className="text-lg font-semibold">{card.fullName}</p>
            <p className="mt-1 text-sm text-cream/90">{card.role}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <button
            type="button"
            className="cta focus-ring-cream flex min-h-[52px] items-center justify-center rounded-full px-5 text-base font-semibold"
            onClick={openCard}
          >
            Abrir meu cartão
          </button>
          <button
            type="button"
            className="cta-outline focus-ring-cream flex min-h-[52px] items-center justify-center rounded-full px-5 text-sm font-semibold"
            onClick={() => setShowInstall((open) => !open)}
            aria-expanded={showInstall}
          >
            Adicionar ao celular
          </button>
          <button
            type="button"
            className="cta-outline focus-ring-cream flex min-h-[52px] items-center justify-center rounded-full px-5 text-sm font-semibold"
            onClick={() => void shareCard()}
          >
            Compartilhar meu cartão
          </button>
        </div>

        {showInstall ? (
          <div className="mt-4">
            <InstallGuide onStatus={setStatus} />
          </div>
        ) : null}

        <button
          type="button"
          className="focus-ring-cream mt-6 min-h-11 self-start text-sm font-medium text-cream"
          onClick={() => setShowQr((open) => !open)}
          aria-expanded={showQr}
        >
          {showQr ? "Ocultar QR profissional" : "Ver QR profissional"}
        </button>

        {showQr ? (
          <div className="mt-4">
            <QrStudio
              value={connectUrl}
              name={slug}
              isLocal={publicCard.isLocal}
              onDownload={(ok) =>
                setStatus(ok ? "QR baixado em alta resolução." : "Não foi possível baixar o QR.")
              }
              onCopy={() => void copyUrl()}
              onShare={() => void shareCard()}
            />
          </div>
        ) : null}

        {status ? (
          <p className="mt-4 text-sm font-medium text-cream" role="status">
            {status}
          </p>
        ) : null}
      </main>
    </div>
  );
}
