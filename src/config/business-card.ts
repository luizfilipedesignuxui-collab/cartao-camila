/**
 * Dados do cartão de Camila Ochoa.
 *
 * Origem: proposta comercial anexada (identidade profissional e contatos).
 * O nome do cliente da proposta estava oculto e não entra neste arquivo.
 *
 * Antes de publicar:
 * - Preencha apenas campos que você realmente tiver.
 * - Deixe vazio o que não existir. A opção some da tela.
 * - Defina `publicUrl` com o endereço final (https://...) se quiser um QR fixo.
 * - Coloque o PDF do currículo em `public/` e aponte `resumeUrl` para ele.
 * - Não invente LinkedIn, portfólio, site ou agenda.
 */
export type BusinessCardConfig = {
  fullName: string;
  firstName: string;
  lastName: string;
  role: string;
  credential: string;
  specialty: string;
  summary: string;
  practiceLine: string;
  location: string;
  /** URL pública final. Vazio = o QR usa o endereço em que a página está aberta. */
  publicUrl: string;
  /** Caminho opcional para um logotipo em `public/` ou URL https. Vazio = monograma. */
  logoSrc: string;
  /** Foto do cartão. Coloque o arquivo em `public/` e use p.ex. "/camila.jpg". Vazio = espaço reservado. */
  photoSrc: string;
  /** Capa do LinkedIn. Coloque o arquivo em `public/` e use p.ex. "/camila-capa.jpg". */
  coverSrc: string;
  monogram: string;
  email: string;
  emailSubject: string;
  /** Telefone como aparece na proposta. A normalização acontece na hora do link. */
  phoneDisplay: string;
  whatsappMessage: string;
  linkedinUrl: string;
  portfolioUrl: string;
  websiteUrl: string;
  /** Ex.: "/curriculo-camila-ochoa.pdf" depois de colocar o arquivo em `public/`. */
  resumeUrl: string;
  resumeFileName: string;
  schedulingUrl: string;
  opportunitySubject: string;
  opportunityBody: string;
  competencies: readonly string[];
  principles: readonly string[];
  /** Experiências só aparecem se forem preenchidas. Não deixe exemplos fictícios. */
  experiences: readonly {
    role: string;
    organization: string;
    period: string;
    detail: string;
  }[];
  /** Formação como está no LinkedIn. Não complete o nome do curso se ele não aparecer. */
  formation: readonly {
    title: string;
    place: string;
    period: string;
  }[];
  options: {
    linkedin: boolean;
    portfolio: boolean;
    website: boolean;
    saveContact: boolean;
    whatsapp: boolean;
    email: boolean;
    scheduling: boolean;
    resumeView: boolean;
    resumeDownload: boolean;
    experience: boolean;
    opportunities: boolean;
    share: boolean;
    downloadQr: boolean;
  };
};

export const businessCard = {
  fullName: "Camila Ochoa",
  firstName: "Camila",
  lastName: "Ochoa",
  role: "Psicóloga organizacional",
  credential: "CRP 06/199974",
  specialty: "Diversidade, inclusão e recolocação",
  summary: "Ética, estratégia e responsabilidade em cada processo.",
  practiceLine:
    "Diversidade e inclusão, desenvolvimento de carreira e mais de 16 anos em recursos humanos.",
  location: "São Paulo, SP",
  publicUrl: "",
  logoSrc: "/logo-camila-ochoa.png",
  photoSrc: "/camila-foto.jpg",
  coverSrc: "/camila-capa.jpg",
  monogram: "CO",
  email: "ochocamila.psi@gmail.com",
  emailSubject: "Contato pelo cartão digital",
  phoneDisplay: "+55 11 93098-8181",
  whatsappMessage:
    "Olá, Camila. Vi seu cartão digital e gostaria de conversar.",
  linkedinUrl: "https://www.linkedin.com/in/camilaochoa/",
  portfolioUrl: "",
  websiteUrl: "",
  resumeUrl: "",
  resumeFileName: "curriculo-camila-ochoa.pdf",
  schedulingUrl: "",
  opportunitySubject: "Oportunidade profissional",
  opportunityBody:
    "Olá, Camila. Entro em contato sobre uma oportunidade profissional.",
  competencies: [
    "Orientação profissional e de carreira",
    "Estratégia de posicionamento",
    "Job hunter",
  ],
  principles: [
    "Ética e responsabilidade",
    "Embasamento técnico",
    "Acolhimento e respeito",
    "Sigilo e confidencialidade",
  ],
  experiences: [
    {
      role: "Psicóloga organizacional e especialista em Diversidade",
      organization: "Lab Yes!",
      period: "Desde 2026",
      detail:
        "Desenvolvimento de carreira do time e do programa Impulsiona, marca profissional, empregabilidade e inclusão.",
    },
  ],
  formation: [
    {
      title: "Executive MBA",
      place: "Universidade São Judas Tadeu",
      period: "2024 a 2025",
    },
    {
      title: "Pós-graduação lato sensu",
      place: "Universidade Paulista",
      period: "2024 a 2025",
    },
    {
      title: "Diversidade, minorias e inclusão",
      place: "PUCRS",
      period: "2023",
    },
    {
      title: "Mestre em Diversidade Inclusiva",
      place: "Pearson",
      period: "2023",
    },
    {
      title: "Auditoria e consultoria em RH",
      place: "Universidade Anhanguera São Paulo",
      period: "2022",
    },
    {
      title: "Universidade Anhanguera São Paulo",
      place: "São Paulo",
      period: "2017 a 2023",
    },
  ],
  options: {
    linkedin: true,
    portfolio: true,
    website: true,
    saveContact: true,
    whatsapp: true,
    email: true,
    scheduling: true,
    resumeView: true,
    resumeDownload: true,
    experience: true,
    opportunities: true,
    share: true,
    downloadQr: true,
  },
} as const satisfies BusinessCardConfig;
