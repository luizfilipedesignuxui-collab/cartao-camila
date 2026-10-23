/**
 * Modelo em branco do cartão digital.
 *
 * Como usar em um novo projeto idêntico:
 * 1. Copie este repositório.
 * 2. Preencha os mesmos campos em `src/config/business-card.ts`.
 * 3. Deixe vazio o que não existir. Campo vazio some da tela.
 * 4. Coloque a foto em `public/` e aponte `photoSrc` (ex.: "/foto.jpg").
 * 5. Não altere layout, cores, componentes ou motion.
 *
 * Referência visual: Figma https://www.figma.com/design/fbFtbk04wUuV7CpT2zI6JJ
 * Playbook: docs/REPLICAR.md
 */
import type { BusinessCardConfig } from "./business-card.ts";

export const businessCard = {
  fullName: "",
  firstName: "",
  lastName: "",
  role: "",
  credential: "",
  specialty: "",
  summary: "",
  practiceLine: "",
  location: "",
  publicUrl: "",
  logoSrc: "",
  photoSrc: "",
  coverSrc: "",
  monogram: "",
  email: "",
  emailSubject: "Contato pelo cartão digital",
  phoneDisplay: "",
  whatsappMessage: "",
  linkedinUrl: "",
  portfolioUrl: "",
  websiteUrl: "",
  resumeUrl: "",
  resumeFileName: "",
  schedulingUrl: "",
  opportunitySubject: "Oportunidade profissional",
  opportunityBody: "",
  competencies: [],
  principles: [],
  experiences: [],
  formation: [],
  options: {
    linkedin: true,
    portfolio: false,
    website: false,
    saveContact: true,
    whatsapp: true,
    email: true,
    scheduling: false,
    resumeView: false,
    resumeDownload: false,
    experience: false,
    opportunities: false,
    share: true,
    downloadQr: true,
  },
} as const satisfies BusinessCardConfig;
