import type { RevealLayer } from "../../lib/reveal.ts";

type LayerNavProps = {
  onBack: () => void;
  onContact: () => void;
  current: RevealLayer;
  tone?: "light" | "dark";
};

export function LayerNav({ onBack, onContact, current, tone = "light" }: LayerNavProps) {
  const back =
    tone === "dark"
      ? "cta-outline focus-ring-cream"
      : "focus-ring bg-surface-raised text-ink ring-1 ring-line";
  const contact =
    tone === "dark"
      ? "cta focus-ring-cream"
      : "cta-on-cream focus-ring";

  const showBack = current === "connection";

  return (
    <nav
      className={`grid w-full max-w-md gap-2 ${showBack ? "grid-cols-2" : "grid-cols-1"}`}
      aria-label="Navegação do cartão"
    >
      {showBack ? (
        <button type="button" className={`min-h-12 rounded-full px-3 text-sm font-semibold ${back}`} onClick={onBack}>
          Voltar
        </button>
      ) : null}
      <button
        type="button"
        className={`min-h-12 rounded-full px-3 text-sm font-semibold ${contact}`}
        onClick={onContact}
        aria-current={current === "connection" ? "page" : undefined}
      >
        Contato
      </button>
    </nav>
  );
}
