import type { ReactNode } from "react";
import type { BusinessCardConfig } from "../config/business-card.ts";
import { buildMailto, buildWhatsAppUrl } from "../lib/contact.ts";
import { ActionIcon } from "./ActionIcon.tsx";

type ContactLinkProps = {
  href: string;
  external?: boolean;
  label: string;
  detail: string;
  icon: ReactNode;
};

export function ContactLink({ href, external, label, detail, icon }: ContactLinkProps) {
  return (
    <a
      href={href}
      className="action-row focus-ring flex min-h-14 w-full items-center gap-3 rounded-md px-4 py-3 text-left"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-media/10">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold">{label}</span>
        <span className="mt-0.5 block text-sm leading-snug break-words text-muted">{detail}</span>
      </span>
    </a>
  );
}

export function QuickContact({ card }: { card: BusinessCardConfig }) {
  const whatsapp = buildWhatsAppUrl(card.phoneDisplay, card.whatsappMessage);
  const email = buildMailto(card.email, card.emailSubject);

  return (
    <div className="flex w-full flex-col gap-2.5">
      {whatsapp ? (
        <ContactLink
          href={whatsapp}
          external
          label="WhatsApp"
          detail={card.phoneDisplay}
          icon={<ActionIcon id="whatsapp" />}
        />
      ) : null}
      {card.linkedinUrl ? (
        <ContactLink
          href={card.linkedinUrl}
          external
          label="LinkedIn"
          detail="linkedin.com/in/camilaochoa"
          icon={<ActionIcon id="linkedin" />}
        />
      ) : null}
      {email ? (
        <ContactLink
          href={email}
          label="E-mail"
          detail={card.email}
          icon={<ActionIcon id="email" />}
        />
      ) : null}
    </div>
  );
}
