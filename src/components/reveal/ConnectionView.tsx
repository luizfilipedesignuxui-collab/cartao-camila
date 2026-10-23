import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { BusinessCardConfig } from "../../config/business-card.ts";
import { newWindowLabel } from "../../lib/a11y.ts";
import type { ActionId, CardAction } from "../../lib/actions.ts";
import { buildEmailComposeUrl, buildWhatsAppUrl } from "../../lib/contact.ts";
import { easeOut, usePrefersReducedMotion } from "../../lib/motion.ts";
import { ActionButton } from "../ActionButton.tsx";
import { ChannelMark, type ChannelId } from "../ChannelMark.tsx";

type ConnectionViewProps = {
  card: BusinessCardConfig;
  extras: readonly CardAction[];
  onAction: (id: ActionId) => void;
};

type StageLink = {
  id: ChannelId;
  href: string;
  label: string;
  detail: string;
  note: string;
  action: string;
  external?: boolean;
};

export function ConnectionView({ card, extras, onAction }: ConnectionViewProps) {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<ChannelId | null>(null);
  const whatsapp = buildWhatsAppUrl(card.phoneDisplay, card.whatsappMessage);
  const email = buildEmailComposeUrl(card.email, card.emailSubject);

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
      external: true,
    });
  }

  const active = links.find((link) => link.id === activeId) ?? null;

  return (
    <motion.div
      className="mx-auto flex h-full min-h-0 w-full max-w-md flex-col px-5 text-cream"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.42, ease: easeOut }}
    >
      <p className="text-xs tracking-[0.16em] text-cream uppercase">Contato</p>
      <h1
        id="titulo-pagina"
        tabIndex={-1}
        className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-cream outline-none focus:outline-none focus-visible:outline-none"
      >
        Fale com Camila
      </h1>

      <div id="contato-direto" className="mt-5">
        <p className="sr-only">Escolha um canal de contato</p>
        <ul className="flex items-center justify-center gap-5">
          {links.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                aria-label={link.label}
                aria-expanded={activeId === link.id}
                aria-controls="contato-detalhe"
                className="focus-ring-cream rounded-full"
                onClick={() => setActiveId(link.id)}
              >
                <ChannelMark id={link.id} active={activeId === link.id} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div id="contato-detalhe" className="mt-4 min-h-12">
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.a
              key={active.id}
              href={active.href}
              className="glass focus-ring flex w-full flex-col items-center rounded-lg px-5 py-4 text-center"
              initial={reduced ? false : { opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.36, ease: easeOut }}
              aria-label={newWindowLabel(`${active.action}: ${active.label} ${active.detail}`, active.external)}
              {...(active.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="text-sm font-semibold text-ink">{active.label}</span>
              <span className="mt-2 text-base font-semibold break-words text-ink">{active.detail}</span>
              <span className="mt-2 text-sm leading-relaxed text-muted">{active.note}</span>
              <span className="cta-on-cream mt-4 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold">
                {active.action}
                {active.external ? <span className="sr-only">, abre em nova aba</span> : null}
              </span>
            </motion.a>
          ) : (
            <p className="text-center text-sm text-cream">Toque em um ícone para ver o contato.</p>
          )}
        </AnimatePresence>
      </div>

      {extras.length > 0 ? (
        <ul className="mt-5 space-y-2.5" aria-label="Ações do cartão">
          {extras.map((action) => (
            <li key={action.id}>
              <ActionButton action={action} tone="dark" onActivate={() => onAction(action.id)} />
            </li>
          ))}
        </ul>
      ) : null}
      <div className="min-h-6 flex-1" aria-hidden="true" />
    </motion.div>
  );
}
