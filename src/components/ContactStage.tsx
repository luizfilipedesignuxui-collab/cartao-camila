import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Mail, MousePointer2 } from "lucide-react";
import { useState, type ReactNode, type Ref } from "react";
import type { BusinessCardConfig } from "../config/business-card.ts";
import { buildMailto, buildWhatsAppUrl } from "../lib/contact.ts";
import { easeOut, usePrefersReducedMotion } from "../lib/motion.ts";
import { ActionIcon } from "./ActionIcon.tsx";
import { PhotoSlot } from "./PhotoSlot.tsx";

type ContactStageProps = {
  card: BusinessCardConfig;
  onClose: () => void;
  closeRef: Ref<HTMLButtonElement>;
};

type StageLink = {
  id: "whatsapp" | "linkedin" | "email";
  href: string;
  label: string;
  detail: string;
  note: string;
  action: string;
  external?: boolean;
  icon: ReactNode;
};

export function ContactStage({ card, onClose, closeRef }: ContactStageProps) {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<StageLink["id"] | null>(null);
  const whatsapp = buildWhatsAppUrl(card.phoneDisplay, card.whatsappMessage);
  const email = buildMailto(card.email, card.emailSubject);

  const links: StageLink[] = [];
  if (whatsapp) {
    links.push({
      id: "whatsapp",
      href: whatsapp,
      label: "WhatsApp",
      detail: card.phoneDisplay,
      note: card.whatsappMessage,
      action: "Abrir conversa",
      external: true,
      icon: <ActionIcon id="whatsapp" tone="onMedia" />,
    });
  }
  if (card.linkedinUrl) {
    links.push({
      id: "linkedin",
      href: card.linkedinUrl,
      label: "LinkedIn",
      detail: "linkedin.com/in/camilaochoa",
      note: `${card.role}. ${card.specialty}.`,
      action: "Abrir perfil",
      external: true,
      icon: <ActionIcon id="linkedin" tone="onMedia" />,
    });
  }
  if (email) {
    links.push({
      id: "email",
      href: email,
      label: "E-mail",
      detail: card.email,
      note: card.emailSubject,
      action: "Escrever e-mail",
      icon: <Mail className="size-5" aria-hidden="true" />,
    });
  }

  const active = links.find((link) => link.id === activeId) ?? null;

  const listMotion = reduced
    ? undefined
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
      };

  const itemMotion = reduced
    ? undefined
    : {
        hidden: { opacity: 0, y: 10, scale: 0.92 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.36, ease: easeOut },
        },
      };

  return (
    <div className="flex min-h-dvh flex-col bg-surface-raised">
      <div className="relative bg-media">
        {card.coverSrc ? (
          <img
            src={card.coverSrc}
            alt="Capa do LinkedIn de Camila Ochoa"
            width={800}
            height={199}
            className="block h-auto w-full object-contain"
          />
        ) : (
          <div className="h-36" />
        )}
        <div className="h-16 bg-media" aria-hidden="true" />
        <button
          ref={closeRef}
          type="button"
          className="glass focus-ring absolute top-3 left-3 z-10 grid size-11 place-items-center rounded-full text-ink"
          aria-label="Recolher cartão"
          onClick={onClose}
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
        <div className="absolute bottom-0 left-1/2 z-10 translate-x-[-50%] translate-y-1/2">
          <PhotoSlot src={card.photoSrc} name={card.fullName} size="xl" ring />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center bg-surface-raised px-5 pt-[5.25rem] pb-8">
        <section className="glass w-full max-w-sm rounded-lg px-5 py-4 text-center" aria-labelledby="nome-camila">
          <h1 id="nome-camila" className="text-[1.65rem] leading-tight font-semibold tracking-[-0.03em] text-ink">
            {card.fullName}
          </h1>
          <p className="mt-2 text-base font-semibold text-media">{card.role}</p>
          <p className="mt-1 text-sm font-medium text-ink">{card.specialty}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{card.practiceLine}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{card.summary}</p>
          <p className="mt-3 text-xs tracking-wide text-muted uppercase">{card.credential}</p>
        </section>

        <nav id="contato-direto" className="mt-6" aria-label="Contato">
          <motion.ul
            className="flex items-center justify-center gap-5"
            initial={reduced ? undefined : "hidden"}
            animate="show"
            variants={listMotion}
          >
            {links.map((link) => {
              const selected = activeId === link.id;
              return (
                <motion.li key={link.id} variants={itemMotion}>
                  <button
                    type="button"
                    aria-label={link.label}
                    aria-expanded={selected}
                    aria-controls="contato-detalhe"
                    className={`icon-dot focus-ring grid size-14 place-items-center rounded-full ${
                      selected ? "icon-dot-active" : ""
                    }`}
                    onClick={() => setActiveId(link.id)}
                  >
                    {link.icon}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        <div className="mt-5 min-h-[9.5rem] w-full max-w-sm">
          <AnimatePresence mode="wait" initial={false}>
            {active ? (
              <motion.a
                key={active.id}
                id="contato-detalhe"
                href={active.href}
                className="glass focus-ring flex w-full flex-col items-center rounded-lg px-5 py-4 text-center"
                initial={reduced ? false : { opacity: 0, y: 18, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: reduced ? 0 : 0.42, ease: easeOut }}
                {...(active.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <motion.span
                  className="text-sm font-semibold text-media"
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.08, duration: 0.28 }}
                >
                  {active.label}
                </motion.span>
                <motion.span
                  className="mt-2 text-base leading-snug font-semibold break-words text-ink"
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.14, duration: 0.28 }}
                >
                  {active.detail}
                </motion.span>
                <motion.span
                  className="mt-2 text-sm leading-relaxed text-muted"
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.2, duration: 0.28 }}
                >
                  {active.note}
                </motion.span>
                <motion.span
                  className="cta mt-4 inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold"
                  initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: reduced ? 0 : 0.26, duration: 0.28 }}
                >
                  {active.action}
                </motion.span>
              </motion.a>
            ) : (
              <motion.div
                key="hint"
                className="glass flex flex-col items-center rounded-lg px-5 py-4"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0 }}
              >
                <MousePointer2 className="size-5 text-media" aria-hidden="true" />
                <p className="mt-3 text-center text-[0.7rem] font-medium tracking-[0.14em] text-muted uppercase">
                  Toque nos ícones para interagir
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
