import { LAYER_LABELS, type RevealLayer } from "../../lib/reveal.ts";

type LayerPillsProps = {
  layers: readonly RevealLayer[];
  current: RevealLayer;
  onSelect: (layer: RevealLayer) => void;
  tone?: "light" | "dark";
};

export function LayerPills({ layers, current, onSelect, tone = "light" }: LayerPillsProps) {
  const steps = layers.filter((layer) => layer !== "entry");
  const idle = tone === "dark" ? "bg-cream/10 text-cream" : "bg-surface-raised text-ink ring-1 ring-line";
  const active = tone === "dark" ? "bg-cream text-ink" : "bg-media text-cream";

  return (
    <nav aria-label="Camadas do Reveal ID">
      <ul className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap">
        {steps.map((layer, index) => (
          <li key={layer} className="min-w-0">
            <button
              type="button"
              className={`${tone === "dark" ? "focus-ring-cream" : "focus-ring"} min-h-11 w-full rounded-full px-3 text-xs font-medium tracking-wide lg:w-auto ${
                current === layer ? active : idle
              }`}
              aria-current={current === layer ? "step" : undefined}
              onClick={() => onSelect(layer)}
            >
              {String(index + 1).padStart(2, "0")} · {LAYER_LABELS[layer]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
