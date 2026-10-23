import type { RevealLayer } from "./reveal.ts";

export const LAYER_ANNOUNCE: Record<RevealLayer, string> = {
  entry: "Entrada do cartão",
  identity: "Identidade de Camila",
  expertise: "Especialidades",
  evidence: "Percurso",
  connection: "Contato de Camila",
};

export function newWindowLabel(label: string, external?: boolean): string {
  return external ? `${label}, abre em nova aba` : label;
}

export function focusPageTitle(): void {
  window.requestAnimationFrame(() => {
    document.getElementById("conteudo")?.focus({ preventScroll: true });
  });
}
