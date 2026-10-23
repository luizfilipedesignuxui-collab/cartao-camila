import type { BusinessCardConfig } from "../config/business-card.ts";
import {
  buildMailto,
  buildWhatsAppUrl,
  isAssetUrl,
  isEmail,
  isHttpUrl,
  normalizeWhatsAppNumber,
} from "./contact.ts";

export type ActionId =
  | "linkedin"
  | "portfolio"
  | "website"
  | "save-contact"
  | "whatsapp"
  | "email"
  | "schedule"
  | "resume-view"
  | "resume-download"
  | "experience"
  | "opportunities"
  | "share"
  | "download-qr";

export type ActionGroupId = "networking" | "direct" | "career" | "card";

export type CardAction = {
  id: ActionId;
  label: string;
  description: string;
  href?: string;
  external?: boolean;
  download?: string;
};

export type ActionGroup = {
  id: ActionGroupId;
  title: string;
  actions: CardAction[];
};

function sameOriginDownloadName(url: string, fileName: string): string | undefined {
  if (url.startsWith("/")) return fileName;
  return undefined;
}

export function buildActionGroups(card: BusinessCardConfig): ActionGroup[] {
  const networking: CardAction[] = [];
  const direct: CardAction[] = [];
  const career: CardAction[] = [];
  const utility: CardAction[] = [];

  if (card.options.linkedin && isHttpUrl(card.linkedinUrl)) {
    networking.push({
      id: "linkedin",
      label: "LinkedIn",
      description: "Abrir perfil profissional",
      href: card.linkedinUrl.trim(),
      external: true,
    });
  }

  if (card.options.portfolio && isHttpUrl(card.portfolioUrl)) {
    networking.push({
      id: "portfolio",
      label: "Portfólio",
      description: "Ver trabalhos e casos",
      href: card.portfolioUrl.trim(),
      external: true,
    });
  }

  if (card.options.website && isHttpUrl(card.websiteUrl)) {
    networking.push({
      id: "website",
      label: "Site",
      description: "Abrir site pessoal",
      href: card.websiteUrl.trim(),
      external: true,
    });
  }

  if (
    card.options.saveContact &&
    card.fullName.trim() &&
    (isEmail(card.email) || normalizeWhatsAppNumber(card.phoneDisplay))
  ) {
    networking.push({
      id: "save-contact",
      label: "Salvar contato",
      description: "Guardar o número na agenda do telefone",
    });
  }

  if (card.options.share) {
    networking.push({
      id: "share",
      label: "Compartilhar",
      description: "Enviar o link do cartão",
    });
  }

  if (card.options.whatsapp) {
    const href = buildWhatsAppUrl(card.phoneDisplay, card.whatsappMessage);
    if (href) {
      direct.push({
        id: "whatsapp",
        label: "WhatsApp",
        description: card.phoneDisplay,
        href,
        external: true,
      });
    }
  }

  if (card.options.email) {
    const href = buildMailto(card.email, card.emailSubject);
    if (href) {
      direct.push({
        id: "email",
        label: "E-mail",
        description: card.email.trim(),
        href,
      });
    }
  }

  if (card.options.scheduling && isHttpUrl(card.schedulingUrl)) {
    direct.push({
      id: "schedule",
      label: "Agendar uma conversa",
      description: "Escolher um horário",
      href: card.schedulingUrl.trim(),
      external: true,
    });
  }

  if (card.options.resumeView && isAssetUrl(card.resumeUrl)) {
    career.push({
      id: "resume-view",
      label: "Visualizar currículo",
      description: "Abrir o PDF",
      href: card.resumeUrl.trim(),
      external: true,
    });
  }

  if (card.options.resumeDownload && isAssetUrl(card.resumeUrl)) {
    career.push({
      id: "resume-download",
      label: "Baixar currículo",
      description: "Salvar o PDF",
      href: card.resumeUrl.trim(),
      download: sameOriginDownloadName(card.resumeUrl.trim(), card.resumeFileName),
      external: !card.resumeUrl.trim().startsWith("/"),
    });
  }

  const hasPractice =
    card.competencies.length > 0 ||
    card.principles.length > 0 ||
    card.experiences.length > 0;

  if (card.options.experience && hasPractice) {
    career.push({
      id: "experience",
      label: "Ver experiências e competências",
      description: "Atuação, princípios e percurso informado",
    });
  }

  if (card.options.opportunities) {
    const href = buildMailto(
      card.email,
      card.opportunitySubject,
      card.opportunityBody,
    );
    if (href) {
      career.push({
        id: "opportunities",
        label: "Oportunidades profissionais",
        description: "Escrever sobre uma vaga ou parceria",
        href,
      });
    }
  }

  if (card.options.downloadQr) {
    utility.push({
      id: "download-qr",
      label: "Baixar QR Code",
      description: "Salvar a primeira tela na galeria",
    });
  }

  const groups: ActionGroup[] = [
    { id: "networking", title: "Networking profissional", actions: networking },
    { id: "direct", title: "Contato direto", actions: direct },
    { id: "career", title: "Carreira e recrutamento", actions: career },
    { id: "card", title: "Este cartão", actions: utility },
  ];

  return groups.filter((group) => group.actions.length > 0);
}
