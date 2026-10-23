export const REVEAL_LAYERS = [
  "entry",
  "identity",
  "expertise",
  "evidence",
  "connection",
] as const;

export type RevealLayer = (typeof REVEAL_LAYERS)[number];

export const LAYER_LABELS: Record<RevealLayer, string> = {
  entry: "Entrada",
  identity: "Identidade",
  expertise: "Especialidades",
  evidence: "Percurso",
  connection: "Conexão",
};

export function layersForCard(): RevealLayer[] {
  return ["entry", "identity", "connection"];
}

export function layerIndex(layers: readonly RevealLayer[], layer: RevealLayer): number {
  return Math.max(0, layers.indexOf(layer));
}

export function nextLayer(
  layers: readonly RevealLayer[],
  layer: RevealLayer,
): RevealLayer | null {
  const index = layerIndex(layers, layer);
  return layers[index + 1] ?? null;
}

export function previousLayer(
  layers: readonly RevealLayer[],
  layer: RevealLayer,
): RevealLayer | null {
  const index = layerIndex(layers, layer);
  return layers[index - 1] ?? null;
}
