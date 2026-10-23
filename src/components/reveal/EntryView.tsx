import { motion } from "framer-motion";
import type { BusinessCardConfig } from "../../config/business-card.ts";
import { easeOut, usePrefersReducedMotion } from "../../lib/motion.ts";
import { BrandLogo } from "../BrandLogo.tsx";
import { PhotoSlot } from "../PhotoSlot.tsx";
import { QrCard } from "../QrCard.tsx";

type EntryViewProps = {
  card: BusinessCardConfig;
  qrValue: string;
  onContact: () => void;
};

export function EntryView({ card, qrValue, onContact }: EntryViewProps) {
  const reduced = usePrefersReducedMotion();
  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.52, delay, ease: easeOut },
        };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden text-cream lg:justify-center lg:py-12">
      <div className="mx-auto flex w-full min-h-0 max-w-5xl flex-1 flex-col overflow-hidden px-5 pt-6 sm:px-8 lg:flex-none lg:pt-0">
        <div className="mt-8 flex min-h-0 flex-1 flex-col lg:mt-0 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,20rem)] lg:items-center lg:gap-6 lg:flex-none">
          <div className="shrink-0">
            <motion.h1
              {...fade(0.1)}
              id="titulo-pagina"
              tabIndex={-1}
              className="mx-auto w-full max-w-md shrink-0 outline-none focus:outline-none focus-visible:outline-none lg:mx-0"
            >
              {card.logoSrc ? (
                <BrandLogo src={card.logoSrc} size="hero" onDark />
              ) : (
                <span className="block text-center text-[clamp(2.1rem,7.4vw,4.8rem)] leading-none font-semibold tracking-[-0.045em] text-pretty lg:text-left">
                  {card.fullName}
                </span>
              )}
              {card.logoSrc ? <span className="sr-only">{card.fullName}</span> : null}
            </motion.h1>
            <motion.p {...fade(0.18)} className="mt-4 text-center text-base text-cream lg:text-left lg:text-lg">
              {card.role}
            </motion.p>
            <motion.p {...fade(0.22)} className="mt-1 max-w-md text-center text-sm text-cream/85 lg:text-left">
              {card.specialty}
            </motion.p>
            <motion.div {...fade(0.28)} className="mt-6 hidden lg:block">
              <PhotoSlot src={card.photoSrc} name={card.fullName} size="hero" onDark />
            </motion.div>
          </div>

          <motion.div {...fade(0.16)} className="hidden lg:block">
            <QrCard
              value={qrValue}
              name={card.fullName}
              compact
              size={148}
              canvasId="qr-entry-desktop"
              animated
              caption="Toque ou escaneie para o convite do LinkedIn."
            />
          </motion.div>

          <motion.div
            {...fade(0.24)}
            className="flex min-h-0 flex-1 items-center justify-between gap-4 pb-9 lg:hidden"
          >
            <PhotoSlot src={card.photoSrc} name={card.fullName} size="lg" onDark />
            <div className="w-[11rem] shrink-0">
              <QrCard
                value={qrValue}
                name={card.fullName}
                compact
                size={108}
                canvasId="qr-entry-mobile"
                animated
                caption="Toque ou escaneie para o convite do LinkedIn."
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        {...fade(0.3)}
        className="shrink-0 px-5 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-8 lg:pb-0"
      >
        <div className="mx-auto w-full max-w-5xl">
          <button
            id="ir-para-contato"
            type="button"
            className="cta focus-ring-cream flex min-h-[52px] w-full items-center justify-center rounded-full px-5 text-base font-semibold lg:max-w-md"
            onClick={onContact}
          >
            Ir para o contato
          </button>
        </div>
      </motion.div>
    </div>
  );
}
