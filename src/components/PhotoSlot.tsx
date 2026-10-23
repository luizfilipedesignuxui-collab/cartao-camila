type PhotoSlotProps = {
  src: string;
  name: string;
  size?: "lg" | "xl" | "hero";
  ring?: boolean;
  onDark?: boolean;
};

const sizes = {
  lg: "size-32",
  xl: "size-36",
  hero: "size-40",
} as const;

export function PhotoSlot({ src, name, size = "lg", ring = false, onDark = false }: PhotoSlotProps) {
  const box = sizes[size];
  const frame = ring
    ? onDark
      ? "ring-[6px] ring-cream"
      : "ring-[6px] ring-surface-raised"
    : onDark
      ? "ring-2 ring-cream/40"
      : "ring-1 ring-line";

  if (src) {
    return (
      <img
        src={src}
        alt={`Foto de ${name}`}
        width={144}
        height={144}
        decoding="async"
        className={`${box} rounded-full object-cover ${frame}`}
      />
    );
  }

  return (
    <div
      className={`${box} grid place-items-center rounded-full border-2 border-dashed border-line bg-surface-raised ${frame}`}
      aria-label={`Espaço para a foto de ${name}`}
    >
      <span className="px-4 text-center text-xs leading-snug font-medium tracking-wide text-muted uppercase">
        Foto
      </span>
    </div>
  );
}
