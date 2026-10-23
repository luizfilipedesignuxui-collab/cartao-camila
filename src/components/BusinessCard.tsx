import { AnimatePresence, motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import { businessCard } from "../config/business-card.ts";
import { buildActionGroups, type ActionId } from "../lib/actions.ts";
import { saveEntryCardToGallery } from "../lib/card-image.ts";
import { entryQrValue, resolvePublicCardUrl } from "../lib/app-location.ts";
import {
  buildShareMessage,
  buildVCard,
  fileSlug,
  isHttpUrl,
  saveVCardToDevice,
  shareOrCopyLink,
} from "../lib/contact.ts";
import { LAYER_ANNOUNCE, focusPageTitle } from "../lib/a11y.ts";
import { easeOut, usePrefersReducedMotion } from "../lib/motion.ts";
import { applyPublicUrl, QR_CANVAS_ID } from "../lib/page.ts";
import { qrColors } from "../lib/qrColors.ts";
import { type RevealLayer } from "../lib/reveal.ts";
import { InkScene } from "./InkScene.tsx";
import { ConnectionView } from "./reveal/ConnectionView.tsx";
import { EntryView } from "./reveal/EntryView.tsx";
import { IdentityView } from "./reveal/IdentityView.tsx";
import { LayerNav } from "./reveal/LayerNav.tsx";

const extraHidden = new Set<ActionId>(["whatsapp", "linkedin", "email", "experience", "opportunities"]);

export function BusinessCard() {
  const card = businessCard;
  const reduced = usePrefersReducedMotion();
  const extras = useMemo(
    () => buildActionGroups(card).flatMap((group) => group.actions).filter((action) => !extraHidden.has(action.id)),
    [card],
  );
  const slug = fileSlug(card.fullName) || "cartao";
  const publicCard = resolvePublicCardUrl({ publicUrl: card.publicUrl, slug });
  const qrValue = entryQrValue(publicCard);
  const [layer, setLayer] = useState<RevealLayer>(() => {
    const value = new URLSearchParams(window.location.search).get("layer");
    return value === "identity" || value === "connection" ? value : "entry";
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (isHttpUrl(publicCard.url) && !publicCard.isLocal) applyPublicUrl(publicCard.url);
  }, [publicCard.url, publicCard.isLocal]);

  useEffect(() => {
    document.documentElement.dataset.stage = "entry";
    return () => {
      delete document.documentElement.dataset.stage;
    };
  }, [layer]);

  useEffect(() => {
    if (!status) return;
    const timeout = window.setTimeout(() => setStatus(""), 4200);
    return () => window.clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    focusPageTitle();
  }, [layer]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && layer !== "entry") {
        setLayer("entry");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [layer]);

  function goBack() {
    setLayer("entry");
  }

  function goContact() {
    setLayer("connection");
  }

  async function shareCard() {
    const result = await shareOrCopyLink(buildShareMessage(card, publicCard.url));
    if (result === "shared") setStatus("O cartão foi enviado.");
    if (result === "copied") setStatus("Link do cartão copiado.");
    if (result === "failed") {
      setStatus("Não foi possível compartilhar nem copiar o link.");
    }
  }

  async function saveContact() {
    const vcard = buildVCard(card);
    if (!vcard) {
      setStatus("Não foi possível gerar o contato.");
      return;
    }
    const result = await saveVCardToDevice(`${slug}.vcf`, vcard);
    if (result === "shared") setStatus("Abra o arquivo para salvar o número na agenda.");
    if (result === "downloaded") setStatus("Contato baixado. Abra o arquivo para salvar na agenda.");
    if (result === "failed") setStatus("Não foi possível salvar o contato.");
  }

  async function saveGallery() {
    setStatus("Preparando a primeira tela...");
    const result = await saveEntryCardToGallery(
      {
        photoSrc: card.photoSrc,
        logoSrc: card.logoSrc,
        fullName: card.fullName,
        role: card.role,
        specialty: card.specialty,
      },
      `${slug}-cartao.png`,
    );
    if (result === "shared") setStatus("Salve a imagem na galeria ou envie pelo celular.");
    if (result === "downloaded") setStatus("Primeira tela salva. Ela deve aparecer na galeria ou nos downloads.");
    if (result === "failed") setStatus("Não foi possível salvar a primeira tela.");
  }

  function onAction(id: ActionId) {
    if (id === "save-contact") {
      void saveContact();
      return;
    }
    if (id === "download-qr") {
      void saveGallery();
      return;
    }
    if (id === "share") void shareCard();
  }

  const paneMotion = reduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.4, ease: easeOut },
      };
  const glassPaneMotion = reduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4, ease: easeOut },
      };

  return (
    <div className="relative h-dvh overflow-hidden bg-bg">
      <InkScene />
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <a className="skip-link" href={layer === "entry" ? "#ir-para-contato" : "#contato-direto"}>
        Ir para o contato
      </a>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {LAYER_ANNOUNCE[layer]}
        {status ? `. ${status}` : ""}
      </p>
      <div className="sr-only" aria-hidden="true">
        <QRCodeCanvas
          id={QR_CANVAS_ID}
          value={qrValue}
          size={176}
          level="H"
          marginSize={2}
          bgColor={qrColors.paper}
          fgColor={qrColors.ink}
        />
      </div>

      <main id="conteudo" tabIndex={-1} className="relative z-10 h-full outline-none" aria-label={`Cartão digital de ${card.fullName}`}>
        <AnimatePresence mode="wait" initial={false}>
          {layer === "entry" ? (
            <motion.div key="entry" className="h-full" {...paneMotion}>
              <EntryView card={card} qrValue={qrValue} onContact={goContact} />
            </motion.div>
          ) : (
            <motion.div key={layer} {...glassPaneMotion} className="flex h-full flex-col overflow-hidden lg:justify-center">
              {layer === "identity" ? <IdentityView card={card} /> : null}
              {layer === "connection" ? (
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-5">
                  <ConnectionView card={card} extras={extras} onAction={onAction} />
                </div>
              ) : null}

              {status ? (
                <p className="mx-auto w-full max-w-md px-5 pb-2 text-center text-sm font-medium text-cream" role="status">
                  {status}
                </p>
              ) : null}

              <div className="shrink-0 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:py-4">
                <div className="mx-auto w-full max-w-md">
                  <LayerNav onBack={goBack} onContact={goContact} current={layer} tone="dark" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
