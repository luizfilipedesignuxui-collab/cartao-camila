type AvatarMarkProps = {
  logoSrc: string;
  size?: "sm" | "md" | "xl";
  ring?: boolean;
};

const sizes = {
  sm: { box: "size-9", glyph: "size-5" },
  md: { box: "size-12", glyph: "size-6" },
  xl: { box: "size-36", glyph: "size-16" },
} as const;

export function AvatarMark({ logoSrc, size = "md", ring = false }: AvatarMarkProps) {
  const { box, glyph } = sizes[size];
  const ringClass = ring ? "ring-[6px] ring-surface-raised" : size === "xl" ? "" : "ring-1 ring-line";

  if (logoSrc) {
    return (
      <img
        src={logoSrc.replace(/\.png$/i, "-ink.png")}
        alt=""
        className={`${box} object-contain ${ringClass}`}
      />
    );
  }

  return (
    <span
      className={`${box} grid place-items-center rounded-full bg-media ${ringClass}`}
      aria-hidden="true"
    >
      {size === "xl" ? (
        <span className="text-4xl font-semibold tracking-[-0.05em] text-cream">CO</span>
      ) : (
        <svg viewBox="0 0 24 24" className={glyph} focusable="false">
          <path
            d="M12 3.2c.5 2.6 1.9 4.3 4.3 4.9-2.4.6-3.8 2.3-4.3 5-.5-2.7-1.9-4.4-4.3-5 2.4-.6 3.8-2.3 4.3-4.9Z"
            className="fill-cream"
          />
        </svg>
      )}
    </span>
  );
}
