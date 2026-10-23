import { ChevronDown } from "lucide-react";
import type { Ref } from "react";

type ExploreButtonProps = {
  open: boolean;
  onClick: () => void;
  buttonRef: Ref<HTMLButtonElement>;
};

export function ExploreButton({ open, onClick, buttonRef }: ExploreButtonProps) {
  return (
    <button
      ref={buttonRef}
      id="explorar-cartao"
      type="button"
      data-open={open ? "true" : "false"}
      className="cta focus-ring flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-4 text-base font-semibold"
      aria-expanded={open}
      aria-controls="interior-cartao"
      onClick={onClick}
    >
      {open ? "Recolher cartão" : "Explorar cartão"}
      <ChevronDown
        aria-hidden="true"
        className={`size-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}
